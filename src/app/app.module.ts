import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { adminLteConf } from './admin-lte.conf';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { LayoutModule } from 'angular-admin-lte';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoadingPageModule, MaterialBarModule } from 'angular-loading-page';
import { AppService } from './shared/app.service';
// import { AlertService } from '../app/component/alert/alert.service';

import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient, HttpRequest } from '@angular/common/http';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,


} from '@angular/material';

import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginModule } from './+login/login.module';
import { LoginComponent } from './+login/login.component';
import { ToastModule, Toast } from 'primeng/toast';
// import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { MessageService } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';     //accordion and accordion tab
import { MenuItem } from 'primeng/api';                 //api
import { RawatinapComponent } from './+kunjungan/rawatinap/rawatinap.component';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InjectionToken, FactoryProvider } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
export const WINDOW = new InjectionToken<Window>('window');
import { AuthGuard } from './shared/auth.guard';
// Import PrimeNG modules
import { AutoCompleteModule } from 'primeng/primeng';
import { BreadcrumbModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { CarouselModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { ChipsModule } from 'primeng/primeng';
import { CodeHighlighterModule } from 'primeng/primeng';
import { ConfirmDialogModule } from 'primeng/primeng';
import { SharedModule } from 'primeng/primeng';
import { ContextMenuModule } from 'primeng/primeng';
import { DataGridModule } from 'primeng/primeng';
import { DataListModule } from 'primeng/primeng';
import { DataScrollerModule } from 'primeng/primeng';
import { DataTableModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { DragDropModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
import { EditorModule } from 'primeng/primeng';
import { FieldsetModule } from 'primeng/primeng';
import { FileUploadModule } from 'primeng/primeng';
import { GalleriaModule } from 'primeng/primeng';
import { GMapModule } from 'primeng/primeng';
import { GrowlModule } from 'primeng/primeng';
import { InputMaskModule } from 'primeng/primeng';
import { InputSwitchModule } from 'primeng/primeng';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/primeng';
import { LightboxModule } from 'primeng/primeng';
import { ListboxModule } from 'primeng/primeng';
import { MegaMenuModule } from 'primeng/primeng';
import { MenuModule } from 'primeng/primeng';
import { MenubarModule } from 'primeng/primeng';
import { MessagesModule } from 'primeng/primeng';
import { MultiSelectModule } from 'primeng/primeng';
import { OrderListModule } from 'primeng/primeng';
import { OverlayPanelModule } from 'primeng/primeng';
import { PaginatorModule } from 'primeng/primeng';
import { PanelModule } from 'primeng/primeng';
import { PanelMenuModule } from 'primeng/primeng';
import { PasswordModule } from 'primeng/primeng';
import { PickListModule } from 'primeng/primeng';
import { ProgressBarModule } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/primeng';
import { RatingModule } from 'primeng/primeng';
import { ScheduleModule } from 'primeng/primeng';
import { SelectButtonModule } from 'primeng/primeng';
import { SlideMenuModule } from 'primeng/primeng';
import { SliderModule } from 'primeng/primeng';
import { SpinnerModule } from 'primeng/primeng';
import { SplitButtonModule } from 'primeng/primeng';
import { StepsModule } from 'primeng/primeng';
import { TabMenuModule } from 'primeng/primeng';
import { TabViewModule } from 'primeng/primeng';
import { TerminalModule } from 'primeng/primeng';
import { TieredMenuModule } from 'primeng/primeng';
import { ToggleButtonModule } from 'primeng/primeng';
import { ToolbarModule } from 'primeng/primeng';
import { TooltipModule } from 'primeng/primeng';
import { TreeModule } from 'primeng/primeng';
import { TreeTableModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { DashboardPendapatanComponent } from './+module/dashboard-pendapatan/dashboard-pendapatan.component';
import { DashboardSdmComponent } from './+module/dashboard-sdm/dashboard-sdm.component';
import { DashboardPersediaanComponent } from './+module/dashboard-persediaan/dashboard-persediaan.component';
import * as drilldown from 'highcharts/modules/drilldown.src.js';
import { TargetindikatorComponent } from './+module/targetindikator/targetindikator.component';
import { DashboardIktComponent } from './+module/dashboard-ikt/dashboard-ikt.component';
import { KunjunganComponent } from './+yankes/kunjungan/kunjungan.component';
import { RujukanComponent } from './+yankes/rujukan/rujukan.component';
import { IndikatorComponent } from './+yankes/indikator/indikator.component';
import { ToptenpenyakitComponent } from './+yankes/toptenpenyakit/toptenpenyakit.component';
import { JumlahkematianComponent } from './+yankes/jumlahkematian/jumlahkematian.component';
import { HasillaboratoriumComponent } from './+yankes/hasillaboratorium/hasillaboratorium.component';
import { DarahComponent } from './+yankes/darah/darah.component';
import { HasilradiologiComponent } from './+yankes/hasilradiologi/hasilradiologi.component';
import { KetersediaandarahComponent } from './+yankes/ketersediaandarah/ketersediaandarah.component';
import { PemenuhandarahComponent } from './+yankes/pemenuhandarah/pemenuhandarah.component';
import { ToptendarahComponent } from './+yankes/toptendarah/toptendarah.component';
import { MutupelayananComponent } from './+yankes/mutupelayanan/mutupelayanan.component';
import * as $ from 'jquery';
import * as moment from 'angular-moment';
import { AlertService } from './component/alert/alert.service';
import { AlertComp } from './component/alert/alert.component';


const windowProvider: FactoryProvider = {
  provide: WINDOW,
  useFactory: () => window
};

export const WINDOW_PROVIDERS = [
  windowProvider
]
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    AppRoutingModule,
    CommonModule,
    CoreModule,
    LayoutModule.forRoot(adminLteConf),
    LoadingPageModule, MaterialBarModule,
    HttpClientModule,
    ChartModule,
    MatInputModule, MatTableModule, MatToolbarModule, MatPaginatorModule,
    LoginModule,
    ToastModule,
    AccordionModule,
    CalendarModule,
    FormsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    // MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    ProgressSpinnerModule,
    AgmCoreModule.forRoot({
      apiKey: '8i7Tf3wrAiuzmA4c16Sh'
    }),
    GMapModule,
    // prime ng module
    // prime ng module 
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CarouselModule,
    ChartModule,
    CheckboxModule,
    ChipsModule,
    CodeHighlighterModule,
    ConfirmDialogModule,
    SharedModule,
    ContextMenuModule,
    DataGridModule,
    DataListModule,
    DataScrollerModule,
    DataTableModule,
    DialogModule,
    DragDropModule,
    DropdownModule,
    EditorModule,
    FieldsetModule,
    FileUploadModule,
    GalleriaModule,
    GrowlModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    LightboxModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessagesModule,
    MultiSelectModule,
    OrderListModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    ScheduleModule,
    SelectButtonModule,
    SlideMenuModule,
    SliderModule,
    SpinnerModule,
    SplitButtonModule,
    StepsModule,
    TabMenuModule,
    TabViewModule,
    TerminalModule,
    TieredMenuModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeTableModule,
    TableModule
    //  end prime ng


  ],
  exports: [MatToolbarModule, MatInputModule, MatTableModule],
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardPendapatanComponent,
    DashboardSdmComponent,
    DashboardPersediaanComponent,
    TargetindikatorComponent,
    DashboardIktComponent,
    KunjunganComponent,
    RujukanComponent,
    IndikatorComponent,
    ToptenpenyakitComponent,
    JumlahkematianComponent,
    HasillaboratoriumComponent,
    DarahComponent,
    HasilradiologiComponent,
    KetersediaandarahComponent,
    PemenuhandarahComponent,
    ToptendarahComponent,
    MutupelayananComponent,
    AlertComp

  ],
  bootstrap: [AppComponent],
  providers: [
    AppService,
    MessageService,
    AlertService,
    WINDOW_PROVIDERS,
    {
      provide: HIGHCHARTS_MODULES,
      useFactory: () => [drilldown]
    },
    { provide: Window, useValue: window },
    AuthGuard

  ]
})
export class AppModule { }

