import { MaterialSearchParams } from './../../base-data/material/material.actions';
import { BaseSearchParams } from './../../common/mro.search-params.modal';
import { AppStore } from './../../app/app.store';
import { Store, Unsubscribe } from 'redux';
import { AppState } from './../../app/app.reducer';
import { Material } from './../../base-data/material/material.modal';
import { Component, OnInit, OnDestroy, Inject, ViewChild,NgZone } from '@angular/core';
import { NavController, InfiniteScroll, Refresher, List, Content } from 'ionic-angular';
import { getMaterials, doRefreshMaterials, loadMoreMaterials } from '../../base-data/material/material.actions';

@Component({
  selector: 'page-inventories',
  templateUrl: 'inventories.html'
})
export class InventoriesPage implements OnInit, OnDestroy {
  @ViewChild(List) list: List;
  @ViewChild(Content) content: Content;
  materials: Material[];
  unsubscribe: Unsubscribe;
  scrollSubscribe: Unsubscribe;
  searchParams: MaterialSearchParams = {
    pageNumber: 1,
    materialName: null,
    materialSno: null
  }
  constructor(public navCtrl: NavController, @Inject(AppStore) private store: Store<AppState>) {
  }
  ngOnDestroy(): void {
    this.unsubscribe();
    this.scrollSubscribe();
  }
  ngOnInit(): void {
    this.unsubscribe = this.store.subscribe(() => {
      this.materials = getMaterials(this.store.getState());
    });
    this.store.dispatch(doRefreshMaterials());
    this.store.dispatch(loadMoreMaterials(this.searchParams));
  }
  scrollToBottom() {
    this.content.scrollToBottom();
  }
  doRefresh(refresher: Refresher) {
    this.searchParams.pageNumber = 1;
    this.store.dispatch(doRefreshMaterials());
    this.store.dispatch(loadMoreMaterials(this.searchParams));
    setTimeout(() => {
      refresher.complete();
    }, 300);
  }
  doInfinite(infiniteScroll: InfiniteScroll) {
    this.scrollSubscribe = this.store.subscribe(() => {
      if (this.store.getState().baseDataState.materialState.loadMoreDataCompleted) {
        infiniteScroll.complete();
      };
      if (!this.store.getState().baseDataState.materialState.hasMoreData) {
        infiniteScroll.enable(false);
      }else{
        infiniteScroll.enable(true);
      }
    });
    this.searchParams.pageNumber++;
    this.store.dispatch(loadMoreMaterials(this.searchParams));
  }
}
