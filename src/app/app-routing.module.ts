import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './shared/auth.guard';
import { DashboardPendapatanComponent } from './+module/dashboard-pendapatan/dashboard-pendapatan.component';
import { DashboardSdmComponent } from './+module/dashboard-sdm/dashboard-sdm.component';
import { DashboardPersediaanComponent } from './+module/dashboard-persediaan/dashboard-persediaan.component';
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

const routes: Routes = [
  // {
  //   path: '', redirectTo: 'login', pathMatch: 'full',
  // },
  /** home protected by authguard */
  { path: '', component: HomeComponent, canActivate: [AuthGuard] , pathMatch: 'full'},
  {
    path: 'home',
    canActivate: [AuthGuard],
    data: {
      // title: 'Dashboard'
    },
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'kunjungan',
        children: [
          {
            path: 'rawatjalan',
            loadChildren: './+kunjungan/rawatjalan/rawatjalan.module#RawatJalanModule'
          },
          {
            path: 'rawatinap',
            loadChildren: './+kunjungan/rawatinap/rawatinap.module#RawatInapModule'
          }
        ]
      },

      {
        path: 'accordion',
        loadChildren: './+accordion/accordion.module#AccordionModule',
        data: {
          title: 'Accordion'
        }
      }, {
        path: 'alert',
        loadChildren: './+alert/alert.module#AlertModule',
        data: {
          title: 'Alert',
        }
      }, {
        path: 'layout',
        data: {
          title: 'Layout',
        },
        children: [
          {
            path: 'configuration',
            loadChildren: './+layout/configuration/configuration.module#ConfigurationModule',
            data: {
              title: 'Configuration'
            }
          }, {
            path: 'custom',
            loadChildren: './+layout/custom/custom.module#CustomModule',
            data: {
              title: 'Disable Layout'
              // disableLayout: true
            }
          }, {
            path: 'content',
            loadChildren: './+layout/content/content.module#ContentModule',
            data: {
              title: 'Content'
            }
          }, {
            path: 'header',
            loadChildren: './+layout/header/header.module#HeaderModule',
            data: {
              title: 'Header'
            }
          }, {
            path: 'sidebar-left',
            loadChildren: './+layout/sidebar-left/sidebar-left.module#SidebarLeftModule',
            data: {
              title: 'Sidebar Left'
            }
          }, {
            path: 'sidebar-right',
            loadChildren: './+layout/sidebar-right/sidebar-right.module#SidebarRightModule',
            data: {
              title: 'Sidebar Right'
            }
          },
        ]
      }, {
        path: 'boxs',
        data: {
          title: 'Boxs',
        },
        children: [
          {
            path: 'box',
            loadChildren: './+boxs/box-default/box-default.module#BoxDefaultModule',
            data: {
              title: 'Box'
            }
          }, {
            path: 'info-box',
            loadChildren: './+boxs/box-info/box-info.module#BoxInfoModule',
            data: {
              title: 'Info Box'
            }
          }, {
            path: 'small-box',
            loadChildren: './+boxs/box-small/box-small.module#BoxSmallModule',
            data: {
              title: 'Small Box'
            }
          }
        ]
      }, {
        path: 'dropdown',
        loadChildren: './+dropdown/dropdown.module#DropdownModule',
        data: {
          title: 'Dropdown',
        }
      }, {
        path: 'tabs',
        loadChildren: './+tabs/tabs.module#TabsModule',
        data: {
          title: 'Tabs',
        }
      }
    ]
  },
  {
    path: 'dashboard-pendapatan',
    component: DashboardPendapatanComponent,
    // data: {
    //   title: 'Pendapatan ',
    // }
  },
  {
    path: 'dashboard-sdm',
    component: DashboardSdmComponent,
    // data: {
    //   title: 'SDM',
    // }
  },
  {
    path: 'dashboard-persediaan',
    component: DashboardPersediaanComponent,
    // data: {
    //   title: 'Persediaan',
    // }
  },
  {
    path: 'targetindikator',
    component: TargetindikatorComponent,
  },
  {
    path: 'dashboard-ikt',
    component: DashboardIktComponent,
  },
  // *** DASHBOARD YANKES
  {
    path: 'kunjungan',
    component: KunjunganComponent,
  },
  {
    path: 'rujukan',
    component: RujukanComponent,
  },
  {
    path: 'indikator',
    component: IndikatorComponent,
  },
  {
    path: 'toptenpenyakit',
    component: ToptenpenyakitComponent,
  },
  {
    path: 'jumlahkematian',
    component: JumlahkematianComponent,
  },
  {
    path: 'hasillaboratorium',
    component: HasillaboratoriumComponent,
  },
  {
    path: 'darah',
    component: DarahComponent,
  },
  {
    path: 'hasilradiologi',
    component: HasilradiologiComponent,
  },
  {
    path: 'ketersediaandarah',
    component: KetersediaandarahComponent,
  },
  {
    path: 'pemenuhandarah',
    component: PemenuhandarahComponent,
  },
  {
    path: 'toptendarah',
    component: ToptendarahComponent,
  },
  {
    path: 'mutupelayanan',
    component: MutupelayananComponent,
  },
    // ***END  DASHBOARD YANKES
  {
    path: 'form',
    data: {
      title: 'Form',
    },
    children: [
      {
        path: 'input-text',
        loadChildren: './+form/input-text/input-text.module#InputTextModule',
        data: {
          title: 'Input Text',
        }
      }
    ]
  }, {
    path: 'login',
    loadChildren: './+login/login.module#LoginModule',
    data: {
      customLayout: true
    }
  }, {
    path: 'register',
    loadChildren: './+register/register.module#RegisterModule',
    data: {
      customLayout: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
