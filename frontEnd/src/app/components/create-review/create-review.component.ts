import { Component, effect } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CollegeService } from '../../services/college.service';
import { Icollege } from '../../models/interfaces/college.interface';
import { ReviewService } from '../../services/review.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-review',
  imports: [ReactiveFormsModule],
  templateUrl: './create-review.component.html',
  styleUrl: './create-review.component.scss',

})
export class CreateReviewComponent {
  reviewForm: FormGroup;
  colleges : Icollege[] = []
  constructor(private fb: FormBuilder,private collegeService:CollegeService,private reviewService:ReviewService,private router : Router) {
    this.reviewForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      collegeId: ['', Validators.required],
      file: [null]
    });

    effect(() => {
     this.colleges = this.collegeService.collegesCom()
    })
  }

  ngOnInit(): void {
   this.collegeService.fetchCollege()   
  }



  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.reviewForm.patchValue({
      file: file
    });
  }

  onSubmit(): void {
    if (this.reviewForm.valid) {
      console.log(this.reviewForm.value);
      this.reviewService.createReview(this.reviewForm.value).subscribe({
        next:(response) => {
          console.log('create review resposne ',response);
          alert('Review Create Successfully')
          this.router.navigate(['/review'])
        },
        error:(error) => {
          console.log('Error occured in the create review page',error)
        }
      })
    }
    
   

  }

  onReset(): void {
    this.reviewForm.reset();
  }
}
