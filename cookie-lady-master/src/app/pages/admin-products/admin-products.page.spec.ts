import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdminProductsPage } from './admin-products.page';

describe('AdminProductsPage', () => {
  let component: AdminProductsPage;
  let fixture: ComponentFixture<AdminProductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProductsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
