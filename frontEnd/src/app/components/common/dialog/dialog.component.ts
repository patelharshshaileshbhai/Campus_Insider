import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {

title = input.required<string>();
btn1Label = input<string>('OK');
btn2Label = input<string>('Cancel');

handleBtn1Click = output<void>();
handleBtn2Click = output<void>();

}
