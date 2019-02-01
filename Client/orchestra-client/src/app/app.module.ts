import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MemberComponent } from './member/member.component';
import { SiteComponent } from './site/site.component';
import { MatMenuModule, MatButtonModule, MatIconModule, MatInputModule, MatDialogModule,MAT_DIALOG_DEFAULT_OPTIONS,MatToolbarModule,MatCardModule,
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MemberAppointmentsComponent } from './member/member-appointments/member-appointments.component';
import { MemberDataComponent, ConfirmDialog,ChangePasswordDialog } from './member/member-data/member-data.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { MemberNewsComponent } from './member/member-news/member-news.component';
import { CreateMemberComponent } from './member/create-member/create-member.component';
import { CreateAppointmentComponent } from './member/create-appointment/create-appointment.component';
import { CreateNewsComponent } from './member/create-news/create-news.component';
import { CreateCompositionComponent } from './member/create-composition/create-composition.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FooterComponent } from './footer/footer.component';
// const config: SocketIoConfig = {url:'http://143.205.196.193:3000', options:{}};
const config: SocketIoConfig = {url:'http://127.0.0.1:3000', options:{}};
// const config: SocketIoConfig = {url:'http://localhost:3000', options:{}};
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    MemberComponent,
    SiteComponent,
    MemberAppointmentsComponent,
    MemberDataComponent,ConfirmDialog,ChangePasswordDialog, MemberNewsComponent, CreateMemberComponent, CreateAppointmentComponent, CreateNewsComponent, CreateCompositionComponent, FooterComponent,
  ],
  imports: [
    NgMultiSelectDropDownModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    MatMenuModule, 
    ScrollDispatchModule,
    ScrollingModule,
    HttpClientModule,
    MatButtonModule, 
    MatInputModule, 
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
	//July
	MatToolbarModule,
    MatCardModule, 
    OwlDateTimeModule, 
    OwlNativeDateTimeModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  entryComponents: [
    ConfirmDialog,ChangePasswordDialog
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
