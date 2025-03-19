import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
title = input('');
btn1Lable = input('Okay')
btn2Lable = input('Cancel')
handlebtn1Click = output()
handlebtn2Click = output()

}
