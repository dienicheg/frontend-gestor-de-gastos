import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../../../config/config.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})

export class NavbarComponent {

  public router = inject(Router)
  public configService = inject(ConfigService)

  onLogout() {
    this.configService.logout()
    this.router.navigateByUrl('/auth')
  }

}
