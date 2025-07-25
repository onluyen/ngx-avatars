import { AvatarConfigService } from './avatar-config.service';
import { AvatarSource } from './sources/avatar-source.enum';
import { AvatarConfig } from './avatar-config';
import { defaultSources, defaultColors, defaultDisableSrcCache } from './avatar.service';
import {AVATAR_CONFIG} from "./avatar-config.token";
import {TestBed} from "@angular/core/testing";

describe('AvatarConfigService', () => {
  describe('AvatarSources', () => {
    it('should return the list of sources with the default order when the user provides an empty list of sources', () => {
      const userConfig: AvatarConfig = { sourcePriorityOrder: [] };
      TestBed.configureTestingModule({
        providers: [
          AvatarConfigService,
          { provide: AVATAR_CONFIG, useValue: userConfig }
        ]
      });

      const avatarConfigService = TestBed.inject(AvatarConfigService);
      expect(avatarConfigService.getAvatarSources(defaultSources)).toEqual(
        defaultSources
      );
    });

    it('should return the list of sources with the default order when the user does not provide a custom avatar configuration', () => {
      const avatarConfigService = TestBed.inject(AvatarConfigService);

      expect(avatarConfigService.getAvatarSources(defaultSources)).toEqual(
        defaultSources
      );
    });

    it('should return the list of sources with the default order when the user provides an unknown list of sources', () => {
      const userConfig: AvatarConfig = {
        sourcePriorityOrder: ['UNKNOWN_SOURCE' as AvatarSource]
      };
      TestBed.configureTestingModule({
        providers: [
          AvatarConfigService,
          { provide: AVATAR_CONFIG, useValue: userConfig }
        ]
      });

      const avatarConfigService = TestBed.inject(AvatarConfigService);
      expect(avatarConfigService.getAvatarSources(defaultSources)).toEqual(
        defaultSources
      );
    });

    it('should override the source priority order when the user provides a valid list of sources', () => {
      const userConfig: AvatarConfig = {
        sourcePriorityOrder: [AvatarSource.INITIALS, AvatarSource.TWITTER]
      };

      TestBed.configureTestingModule({
        providers: [
          AvatarConfigService,
          { provide: AVATAR_CONFIG, useValue: userConfig }
        ]
      });

      const avatarConfigService = TestBed.inject(AvatarConfigService);

      const expectedSourcesOrder = [
        AvatarSource.INITIALS,
        AvatarSource.TWITTER,
        AvatarSource.FACEBOOK,
        AvatarSource.GOOGLE,
        AvatarSource.INSTAGRAM,
        AvatarSource.VKONTAKTE,
        AvatarSource.SKYPE,
        AvatarSource.GRAVATAR,
        AvatarSource.GITHUB,
        AvatarSource.CUSTOM,
        AvatarSource.VALUE
      ];
      expect(avatarConfigService.getAvatarSources(defaultSources)).toEqual(
        expectedSourcesOrder
      );
    });

    it('should ignore redundant sources', () => {
      const userConfig: AvatarConfig = {
        sourcePriorityOrder: [AvatarSource.INITIALS, AvatarSource.INITIALS]
      };

      TestBed.configureTestingModule({
        providers: [
          AvatarConfigService,
          { provide: AVATAR_CONFIG, useValue: userConfig }
        ]
      });

      const avatarConfigService = TestBed.inject(AvatarConfigService);
      const expectedSourcesOrder = [
        AvatarSource.INITIALS,
        AvatarSource.FACEBOOK,
        AvatarSource.GOOGLE,
        AvatarSource.TWITTER,
        AvatarSource.INSTAGRAM,
        AvatarSource.VKONTAKTE,
        AvatarSource.SKYPE,
        AvatarSource.GRAVATAR,
        AvatarSource.GITHUB,
        AvatarSource.CUSTOM,
        AvatarSource.VALUE
      ];
      expect(avatarConfigService.getAvatarSources(defaultSources)).toEqual(
        expectedSourcesOrder
      );
    });
  });

  describe('AvatarColors', () => {
    it('should return the user\'s list of colors when provided in the avatar configuration', () => {
      const userColors = ['#ccc', '#fff'];
      const userConfig: AvatarConfig = {
        colors: userColors
      };

      TestBed.configureTestingModule({
        providers: [
          AvatarConfigService,
          { provide: AVATAR_CONFIG, useValue: userConfig }
        ]
      });

      const avatarConfigService = TestBed.inject(AvatarConfigService);
      expect(avatarConfigService.getAvatarColors(defaultColors)).toBe(
        userColors
      );
    });

    it('should return the default colors when no colors are provided in the avatar configuration', () => {
      const avatarConfigService = TestBed.inject(AvatarConfigService);

      expect(avatarConfigService.getAvatarColors(defaultColors)).toBe(
        defaultColors
      );
    });
  });
});

describe('AvatarDisableCache', () => {
  it('should return the user\'s disable custom source cache settings when provided in the avatar configuration', () => {
    const userDisableSrcCache = true;
    const userConfig: AvatarConfig = {
      disableSrcCache: userDisableSrcCache
    };

    TestBed.configureTestingModule({
      providers: [
        AvatarConfigService,
        { provide: AVATAR_CONFIG, useValue: userConfig }
      ]
    });

    const avatarConfigService = TestBed.inject(AvatarConfigService);
    expect(avatarConfigService.getDisableSrcCache(defaultDisableSrcCache)).toBe(
      userDisableSrcCache
    );
  });

  it('should return the default disable custom source cache settings when no settings are provided in the avatar configuration', () => {
    const avatarConfigService = TestBed.inject(AvatarConfigService);

    expect(avatarConfigService.getDisableSrcCache(defaultDisableSrcCache)).toBe(
      defaultDisableSrcCache
    );
  });
});
