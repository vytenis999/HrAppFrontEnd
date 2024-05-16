import { Component, OnInit } from '@angular/core';
import { NotesService } from 'src/app/services/notes.service';
import{Notes} from 'src/app/models/notes.model'
import { Categories } from 'src/app/models/category.model';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sticky-notes',
  templateUrl: './sticky-notes.component.html',
  styleUrls: ['./sticky-notes.component.scss']
})
export class StickyNotesComponent implements OnInit {

    listNotes: Notes[] = [];
    listCategories: Categories[] = [];
    draggedNote!: Notes;
    addedCategory: Categories = new Categories;
    displayCategory: boolean = false;
    displayNote: boolean = false;
    displayCategoryUpdate: boolean = false;
    displayNoteUpdate: boolean = false;
    addedNote: string='';
    ID: number = 0;
    updatingCategory!: Categories;
    color: string = '';
    isPrivate: boolean= true;
    selectedValue: string = '';
    

    constructor(private noteService: NotesService, private messageService: MessageService) { }

    ngOnInit() {
      this.isPrivate = true;
      this.getNotes();
    }

    getNotes(){
      this.noteService.getAllNotes(this.isPrivate).then(notes=> this.listNotes = notes);
      this.noteService.getCategory(this.isPrivate).then(category=> this.listCategories = category);
    }


  drop(event: CdkDragDrop<Notes[]>, category: Categories) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      this.draggedNote = event.item.data;
      if (this.draggedNote) {
        for(let i=0; i< this.listNotes.length;i++){
          if(this.draggedNote.id === this.listNotes[i].id){
            this.listNotes[i].categoryId=category.id;
            this.noteService.updateNote(this.listNotes[i].id, this.listNotes[i]);
            break;
          }
        }
        this.draggedNote = new Notes;
    }
    }
  }

  isEqual(condition1: number, condition2: number){
    if(condition1 === condition2){
      return true;
    }
    else return false;
    
  }

  addNewCategory(){

    if(this.addedNote !== '' && this.color !== ''){  
      this.noteService.addCategory(this.addedNote, this.color, this.isPrivate).subscribe((res)=>{
        // console.log(res);
        this.getNotes();
      });
      this.messageService.add({severity:'success', summary: 'Įvykdyta sėkminga!', detail: 'Kategorija pridėta', life: 3000});
    }
   
     
    this.addedNote='';
    this.displayCategory=false;   
  }

  addNewNote(){
    if(this.addedNote !== ''  && this.color !== ''){
      this.noteService.addNote(this.ID, this.addedNote, this.color, this.isPrivate).subscribe((res)=>{
        // console.log(res);
        this.getNotes();
      });
     this.messageService.add({severity:'success', summary: 'Įvykdyta sėkminga!', detail: 'Note pridėtas', life: 3000});
    }
    this.addedNote='';
    this.ID = 0;
    this.displayNote=false; 
  }

  deleteCategory(){
    if(this.ID !=0){
      this.noteService.deleteCategory(this.ID);
      this.listCategories.forEach((value, index)=>{
        if(value.id===this.ID) {this.listCategories.splice(index,1);
        this.messageService.add({severity:'success', summary: 'Įvykdyta sėkminga!', detail: 'Kategorija ištrinta', life: 3000});
        }
      });

      this.listNotes.forEach((value, index)=>{
        if(value.categoryId===this.ID) this.listNotes.splice(index,1);
      });     
    }
    this.displayCategoryUpdate = false;
  }

  deleteNote(){
    if(this.ID !=0){
      this.noteService.deleteNote(this.ID);
      this.listNotes.forEach((value, index)=>{
        if(value.id===this.ID) {this.listNotes.splice(index,1);
          this.messageService.add({severity:'success', summary: 'Įvykdyta sėkminga!', detail: 'Note ištrintas', life: 3000});
        }
      });
    }
    this.displayNoteUpdate = false;
  }

 
  updateCategory(){
    if(this.addedNote !== '' && this.color !== ''){
      if (this.updatingCategory) {
        for(let i=0; i< this.listCategories.length;i++){
          if(this.updatingCategory.id === this.listCategories[i].id){
            this.listCategories[i].title = this.addedNote;
            this.listCategories[i].color = this.color;
            this.noteService.updateCategory(this.ID, this.addedNote, this.listCategories[i].color);
           this.messageService.add({severity:'success', summary: 'Įvykdyta sėkminga!', detail: 'Kategorija atnaujinta', life: 3000});
            break;
          }
        }

    }
      
    }
    this.addedNote='';
    this.ID = 0;
    this.displayCategoryUpdate=false; 
  }

  updateNote(){
    if(this.addedNote !== '' && this.color !== ''){
      if (this.draggedNote) {
        for(let i=0; i< this.listNotes.length;i++){
          if(this.draggedNote.id === this.listNotes[i].id){
            this.listNotes[i].content = this.addedNote;
            this.listNotes[i].color = this.color;
            this.noteService.updateNote(this.ID, this.listNotes[i]);
            this.messageService.add({severity:'success', summary: 'Įvykdyta sėkminga!', detail: 'Note atnaujintas', life: 3000});
            break;
          }
        }

    }
    }
    this.addedNote='';
    this.ID = 0;
    this.displayNoteUpdate=false; 
  }

  showCategoryDialog(){
    this.color = '#faf5ff';  
    this.selectedValue = this.color;
    this.displayCategory = true;
  }
  showNoteDialog(id: number){
    this.ID = id;
    this.color = '#faf5ff';
    this.selectedValue = this.color;
    this.displayNote = true;
  }
  showCategoryUpdateDialog(category: Categories){
    this.updatingCategory = category;
    this.ID = category.id;
    this.addedNote = category.title;
    this.color = category.color;
    this.selectedValue = this.color;
    this.displayCategoryUpdate = true;
  }
  showNoteUpdateDialog(note: Notes){
    this.draggedNote = note;
    this.ID = note.id;
    this.addedNote = note.content;
    this.color = note.color;
    this.selectedValue = this.color;
    this.displayNoteUpdate = true;
  }

  dialogHide(){
    this.draggedNote = new Notes;
    this.updatingCategory = new Categories;
    this.ID = 0;
    this.addedNote = '';
    this.color = '';
    this.selectedValue = '';
  }

  onItemChange(e: any){
    this.color = e.target.value;
    console.log(" Value is : ",  this.color);
 }

 displayPrivate(){
  this.isPrivate = true;
  this.listCategories.splice(0);
  this.listNotes.splice(0);
  this.getNotes();
 }

 displayPublic(){
  this.isPrivate = false;
  this.listCategories.splice(0);
  this.listNotes.splice(0);
  this.getNotes();
 }

}
