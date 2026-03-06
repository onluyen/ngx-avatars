import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
type Style = Partial<CSSStyleDeclaration>;

@Component({
  selector: 'ngx-avatars',
  standalone: true,
  imports: [CommonModule],
  styles: [
    `
      :host {
        display: inline-block;
        border-radius: 50%;
      }
      .avatar-container {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      .avatar-content {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }
      img.avatar-content {
        object-fit: cover;
        width: 100%;
        height: 100%;
      }
    `
  ],
  template: `
    <div class="avatar-container" [ngStyle]="hostStyle">
      @if (resolvedSrc) {
        <img
          class="avatar-content"
          [src]="resolvedSrc"
          [alt]="name || 'avatar'"
          [attr.referrerPolicy]="referrerpolicy"
          (error)="onImgError()"
        />
      } @else {
        <div class="avatar-content" [ngStyle]="textStyle">{{ initialsText }}</div>
      }
    </div>
  `
})
export class SimpleAvatarComponent implements OnChanges {
  @Input() src: string | SafeUrl | null = null;
  @Input() name: string | null = null;
  @Input() initialsSize = 0; // 0 = auto (up to 2)
  @Input() size: number | string = 50;
  @Input() round = true;
  @Input() cornerRadius: number | string = 0;
  @Input() bgColor?: string;
  @Input() fgColor: string = '#FFF';
  @Input() borderColor?: string;
  @Input() style: Style = {};
  @Input() referrerpolicy?: string | null;

  hostStyle: Style = {};
  textStyle: Style = {};
  initialsText: string = '';
  resolvedSrc: string | null = null;
  private sanitizer = inject(DomSanitizer);

  ngOnChanges(changes: SimpleChanges): void {
    this.initialsText = this.computeInitials(this.name ?? '');
    const radius = this.round ? '50%' : `${this.cornerRadius}px`;
    const pxSize = typeof this.size === 'number' ? `${this.size}px` : this.size;
    this.hostStyle = {
      width: pxSize,
      height: pxSize,
      borderRadius: radius,
      ...this.style
    };
    this.textStyle = {
      color: this.fgColor,
      backgroundColor: this.bgColor || this.pickColor(this.name ?? ''),
      border: this.borderColor ? `1px solid ${this.borderColor}` : '',
      borderRadius: radius,
      font: `${Math.floor(+(<any>this.size) / 3)}px Helvetica, Arial, sans-serif`,
      textTransform: 'uppercase',
      lineHeight: pxSize
    };
    this.resolvedSrc = typeof this.src === 'string'
      ? this.src
      : this.src
        ? this.sanitizer.sanitize(SecurityContext.URL, this.src) ?? null
        : null;
  }

  onImgError(): void {
    this.src = null;
    this.resolvedSrc = null;
  }

  private computeInitials(name: string): string {
    const parts = (name || '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    const candidate = parts
      .slice(0, 2)
      .map(p => p.charAt(0))
      .join('');
    if (this.initialsSize && this.initialsSize > 0) {
      return candidate.slice(0, this.initialsSize).toUpperCase();
    }
    return candidate.toUpperCase();
  }

  private pickColor(seed: string): string {
    // simple deterministic color from seed
    const colors = ['#1abc9c', '#3498db', '#9b59b6', '#e67e22', '#e74c3c', '#2c3e50', '#16a085', '#27ae60', '#2980b9'];
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % colors.length;
    return colors[idx];
  }
}
