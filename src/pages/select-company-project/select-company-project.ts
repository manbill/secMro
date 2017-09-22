import { TabsPage } from './../tabs/tabs';
import { selectProject } from './../../project/project.actions';
import { selectCompany, SelectCompanyAction } from './../../company/company.actions';
import { AppState } from './../../app/app.reducer';
import { Store, Unsubscribe } from 'redux';
import { AppStore } from './../../app/app.store';
import { Inject } from '@angular/core';
import { Company } from './../../company/company.modal';
import { CompanyEntities } from './../../company/company.reducer';
import { Project } from './../../project/project.modal';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, AlertOptions } from 'ionic-angular';
import { MroUtils } from '../../common/mro-util';
import { getUserSelectedProject } from '../../user/user.reducer';

/**
 * Generated class for the SelectCompanyProjectPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-select-company-project',
  templateUrl: 'select-company-project.html',
})
export class SelectCompanyProjectPage {
  selectProjectForm: FormGroup;
  companies: Company[];
  unsubscribe: Unsubscribe;
  companyProjects: Project[];
  constructor(public navCtrl: NavController, private fb: FormBuilder, @Inject(AppStore) private store: Store<AppState>, public navParams: NavParams) {
    this.unsubscribe = this.store.subscribe(() => {
      this.update();
    })
    this.createSelectProjectForm();
    this.selectProjectForm.get("company").valueChanges.subscribe((company) => {
      console.log('改变了公司', company);
      this.store.dispatch(selectCompany(company));
    });
    this.update();
  }
  getcompanies() {
    const entities = this.store.getState().userState.companyState.companyEntities;
    return Object.keys(entities)
      .map(id => entities[id]);
  }
  getProjectsOfCompany() {
    const projectIds = this.store.getState().userState.projectState.ids.filter((pId) => this.store.getState().userState.companyState.selectedCompany.projectIds.some(cid => cid == pId));
    return projectIds.map(pid => this.store.getState().userState.projectState.projectEntities[pid]);
  }
  update() {
    this.companies = this.getcompanies();
    this.companyProjects = this.getProjectsOfCompany();
    console.log("companies", this.companies);
    console.log("companyProjects", this.companyProjects);
  }
  createSelectProjectForm() {
    let project = getUserSelectedProject(this.store.getState());
    this.selectProjectForm = this.fb.group({
      company: [this.store.getState().userState.companyState.selectedCompany, Validators.required],
      project: [MroUtils.isNotEmpty(project) ? project : null, Validators.required]
    });
  }

  companyCompareWith(company1: Company, company2: Company) {
    return company1 && company2 ? company1.companyId === company2.companyId : company1 === company2;
  }
  projectCompareWith(pro1: Project, pro2: Project) {
    return pro1 && pro2 ? pro1.projectId === pro2.projectId : pro1 === pro2;
  }
  onSelectProject() {
    //选择完公司和项目后，跳转到首页，先判断是否是不同的项目，相同项目，直接跳转首页，否则清空业务数据，重新下载业务数据
    this.store.dispatch(selectCompany(this.selectProjectForm.get('company').value));
    this.store.dispatch(selectProject(this.selectProjectForm.get('project').value));
    this.navCtrl.setRoot(TabsPage);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectCompanyProjectPage');

  }
  ionViewDidLeave() {
    console.log("leave SelectCompanyProjectPage");
  }
  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe&&this.unsubscribe();
  }
}
