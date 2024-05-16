import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {FormsModule} from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {StyleClassModule} from "primeng/styleclass";
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {CheckboxModule} from 'primeng/checkbox';
import {MenubarModule} from 'primeng/menubar';
import {AvatarModule} from 'primeng/avatar';
import {AvatarGroupModule} from 'primeng/avatargroup';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import {MultiSelectModule} from 'primeng/multiselect';
import {ContextMenuModule} from 'primeng/contextmenu';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {ProgressBarModule} from 'primeng/progressbar';
import {FileUploadModule} from 'primeng/fileupload';
import {ToolbarModule} from 'primeng/toolbar';
import {RatingModule} from 'primeng/rating';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputNumberModule} from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasswordModule } from "primeng/password";
import { DividerModule } from "primeng/divider";
import {AccordionModule} from 'primeng/accordion';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import {MenuItem} from 'primeng/api';
import {EditorModule} from 'primeng/editor';
import { DragDropModule} from '@angular/cdk/drag-drop';
import {TimelineModule} from 'primeng/timeline';
import {ScrollerModule} from 'primeng/scroller';
import { ColorPickerModule } from 'primeng/colorpicker';
import {SidebarModule} from 'primeng/sidebar';


import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { EntryPageComponent } from './pages/entry-page/entry-page.component';
import { HeaderComponent } from './components/header/header.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { TableCandidatePageComponent } from './pages/table-candidate-page/table-candidate-page.component';
import { AddCandidatePageComponent } from './pages/add-candidate-page/add-candidate-page.component';
import { CalendarPageComponent } from './pages/calendar-page/calendar-page.component';
import { ClientPageComponent } from './pages/client-page/client-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { UsersListPageComponent } from './pages/users-list-page/users-list-page.component';
import {JWT_OPTIONS, JwtHelperService} from "@auth0/angular-jwt";
import {LoginService} from "./services/login.service";
import {AuthInterceptor} from "./auth.interceptor";
import { UserTableComponent } from './components/user-table/user-table.component';
import {ClientTableComponent} from "./components/client-table/client-table.component";
import { CandidateTableComponent } from './components/candidate-table/candidate-table.component';
import { CandidateCreateComponent } from './components/candidate-create/candidate-create.component';
import { CandidateService } from './services/candidate.service';
import { ProfileComponent } from './components/profile/profile.component';
import {DecryptToken} from "./decrypt-token";
import { ForgotPassPageComponent } from './pages/forgot-pass-page/forgot-pass-page.component';
import { ForgotPassComponent } from './components/forgot-pass/forgot-pass.component';
import { ResetPasswordPageComponent } from './pages/reset-password-page/reset-password-page.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { TaxComponent } from './components/tax/tax.component';
import { TaxPageComponent } from './pages/tax-page/tax-page.component';
import {CalendarComponent} from "./components/calendar/calendar.component";

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { StickyNotesComponent } from './components/sticky-notes/sticky-notes.component';
import {MessageModule} from "primeng/message";
import {ProgressSpinnerModule} from "primeng/progressspinner";

FullCalendarModule.registerPlugins([
  interactionPlugin,
  dayGridPlugin
]);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginPageComponent,
    NotFoundPageComponent,
    EntryPageComponent,
    HeaderComponent,
    HomePageComponent,
    TableCandidatePageComponent,
    AddCandidatePageComponent,
    CalendarPageComponent,
    ClientPageComponent,
    ProfilePageComponent,
    UsersListPageComponent,
    UserTableComponent,
    CandidateTableComponent,
    CandidateCreateComponent,
    ClientTableComponent,
    ProfileComponent,
    ForgotPassPageComponent,
    ForgotPassComponent,
    ResetPasswordPageComponent,
    ResetPasswordComponent,
    TaxComponent,
    TaxPageComponent,
    CalendarComponent,
    StickyNotesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    StyleClassModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    MenubarModule,
    BrowserAnimationsModule,
    AvatarModule,
    AvatarGroupModule,
    HttpClientModule,
    TableModule,
    ToastModule,
    CalendarModule,
    SliderModule,
    MultiSelectModule,
    ContextMenuModule,
    DialogModule,
    DropdownModule,
    ProgressBarModule,
    FileUploadModule,
    ToolbarModule,
    RatingModule,
    RadioButtonModule,
    InputNumberModule,
    ConfirmDialogModule,
    InputTextareaModule,
    PasswordModule,
    DividerModule,
    RouterModule,
    AccordionModule,
    TabViewModule,
    EditorModule,
    DragDropModule,
    FullCalendarModule,
    FullCalendarModule,
    TimelineModule,
    ScrollerModule,
    ColorPickerModule,
    SidebarModule,
    MessageModule,
    ProgressSpinnerModule,
  ],
  providers: [AppComponent,{ provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    LoginService,
    CandidateService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    { provide: DecryptToken, useValue: DecryptToken },
    MessageService,
    ConfirmationService,
    JwtHelperService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
