import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { AvatarModule } from 'ngx-avatars';
import { UserService } from './app/user.service';

if (environment.production) {
  enableProdMode();
}

const avatarColors = ['#FFB6C1', '#2c3e50', '#95a5a6', '#f39c12', '#1abc9c'];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(AvatarModule.forRoot({ colors: avatarColors })),
    UserService
  ]
}).catch(err => console.error(err));
