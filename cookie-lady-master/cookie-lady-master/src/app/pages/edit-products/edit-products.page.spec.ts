import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditProductsPage } from './edit-products.page';

describe('EditProductsPage', () => {
  let component: EditProductsPage;
  let fixture: ComponentFixture<EditProductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProductsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
