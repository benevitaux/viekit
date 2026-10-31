/**
 * Device hardware abstractions (Torch, Geolocation, Orientation, Battery, Single File Export)
 */

class DeviceManager {
  private torchTrack: MediaStreamTrack | null = null;
  private torchStream: MediaStream | null = null;
  private isTorchOn = false;

  /**
   * Request hardware LED torch if supported by browser/device
   */
  public async toggleTorch(): Promise<{ supported: boolean; active: boolean; error?: string }> {
    if (this.isTorchOn) {
      this.turnTorchOff();
      return { supported: true, active: false };
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return { supported: false, active: false, error: 'Camera mediaDevices not supported' };
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
        },
      });

      const track = stream.getVideoTracks()[0];
      if (!track) {
        return { supported: false, active: false, error: 'No video track found' };
      }

      // Check capabilities
      const capabilities = (track.getCapabilities ? track.getCapabilities() : {}) as { torch?: boolean };
      if (!capabilities.torch) {
        // Stop stream
        track.stop();
        return { supported: false, active: false, error: 'Hardware torch constraint not available' };
      }

      // Turn torch on
      await track.applyConstraints({
        advanced: [{ torch: true } as unknown as MediaTrackConstraintSet],
      });

      this.torchStream = stream;
      this.torchTrack = track;
      this.isTorchOn = true;
      return { supported: true, active: true };
    } catch (err: unknown) {
      this.turnTorchOff();
      return { supported: false, active: false, error: (err as Error)?.message || 'Torch permission denied' };
    }
  }

  public turnTorchOff() {
    if (this.torchTrack) {
      try {
        this.torchTrack.stop();
      } catch {
        // Ignore
      }
      this.torchTrack = null;
    }
    if (this.torchStream) {
      try {
        this.torchStream.getTracks().forEach((t) => t.stop());
      } catch {
        // Ignore
      }
      this.torchStream = null;
    }
    this.isTorchOn = false;
  }

  public getTorchState(): boolean {
    return this.isTorchOn;
  }

  /**
   * Request iOS 13+ Device Orientation Permission if required
   */
  public async requestOrientationPermission(): Promise<boolean> {
    const DeviceOrientationEventAny = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
    if (typeof DeviceOrientationEventAny?.requestPermission === 'function') {
      try {
        const response = await DeviceOrientationEventAny.requestPermission();
        return response === 'granted';
      } catch {
        return false;
      }
    }
    return true;
  }

  /**
   * Export the entire running web app as a standalone single-file HTML download
   */
  public exportCurrentAppAsSingleHtml(filename = 'VieKit-Emergency-Offline.html') {
    try {
      const htmlContent = document.documentElement.outerHTML;
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      console.error('Failed to export HTML', err);
      return false;
    }
  }
}

export const deviceManager = new DeviceManager();
