import { CommonModule, FormatWidth } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-post',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent implements OnInit {

  postData : FormGroup;
  imagePreviews: { file: File, preview: string | ArrayBuffer }[] = [];

  constructor(
    private fb : FormBuilder,
    private postService : PostService,
    private http : HttpClient,
    private router: Router,
    private route : ActivatedRoute) {
      this.postData = this.fb.group({
        title : ['',Validators.required],
        content : ['',Validators.required],
        images : this.fb.array([],Validators.required)
      })
    }

  ngOnInit(): void {
    
  }

  get images():FormArray{
    return this.postData.get('images') as FormArray;
  }

  // Handle file selection and preview
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
     // const files = Array.from(input.files);

     const file = input.files[0]; // Only take the first file

     // Clear existing images if any
     this.images.clear();
     this.imagePreviews = [];

     
    // Add to FormArray 
    this.images.push(this.fb.control(file));

    // Generate preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviews.push({
        file: file,
        preview: reader.result as string
      });
    };
    reader.readAsDataURL(file);
 

      // files.forEach(file => {
      //   //Add to FormArray 
      //   this.images.push(this.fb.control(file));

      //   //Generate preview 
      //   const reader = new FileReader();
      //   reader.onload = () => {
      //     this.imagePreviews.push({
      //       file : file,
      //       preview : reader.result as string
      //     })
      //   }
      //   reader.readAsDataURL(file);
      // })
    }
  }
   
  //Remove image at index 
  removeImage (index : number):void{
    this.images.removeAt(index);
    this.imagePreviews.splice(index, 1);
  }
 
  //Submit form data to API 
  onSubmit():void{
    if(this.postData.valid){
      const formData = new FormData();
      formData.append('title',this.postData.get('title')?.value);
      formData.append('content',this.postData.get('content')?.value);
    const image = this.images.at(0).value;
      formData.append('file',image)

      //Append all images 
      // this.images.controls.forEach((control, index) => {
      //   formData.append(`file[${index}]`,control.value);
      // });

      this.postService.createPost(formData);
      

      //API call 
      // this.http.post('',formData).subscribe(
      //   (response) => {
      //     console.log('Upload Successful',response);
      //     this.resetForm();
      //   },
      //   (error) => {
      //     console.error('Upload Failed ',error);
      //   }
      // )

    }
  }


  // Reset form
  resetForm(): void {
    this.postData.reset();
    this.images.clear();
    this.imagePreviews = [];
  }
}
