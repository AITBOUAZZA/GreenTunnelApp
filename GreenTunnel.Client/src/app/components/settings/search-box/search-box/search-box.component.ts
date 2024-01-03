 

import { Component, ViewChild, ElementRef, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent {

  @Input()
  placeholder = 'Search...';

  @Output()
  searchChange = new EventEmitter<string>();

  @ViewChild('searchInput')
  searchInput: ElementRef;

  onValueChange(value: string) {
    this.searchChange.emit(value);
  }

  clear() {
    this.searchInput.nativeElement.value = '';
    this.onValueChange('');
  }
}
