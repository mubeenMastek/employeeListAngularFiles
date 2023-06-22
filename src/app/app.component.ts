import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmpAddEditComponent } from './emp-add-edit/emp-add-edit.component';
import { EmployeeService } from './services/employee.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort, Sort} from '@angular/material/sort';
import { CoreService } from './core/core.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit  {
  title = 'crud-app';

  displayedColumns: string[] = [
    'id', 
    'firstName', 
    'lastName', 
    'email', 
    'dob', 
    'gender', 
    'education', 
    'company', 
    'experience', 
    'package',
    'action'
  ];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  
  constructor(
    private _dialog:MatDialog, 
    private _empService:EmployeeService,
    private _coreService:CoreService){   
  }

  ngOnInit():void{
    this.getEmployeeList();
  }

  openAddEditEmpForm(){
      const DialogRef = this._dialog.open(EmpAddEditComponent);
      DialogRef.afterClosed().subscribe({
        next:(val)=>{
          if(val){
            this.getEmployeeList();
          }
        }
      })
  }
  getEmployeeList(){
    this._empService.getEmployeeList().subscribe({
      next: (res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err)=> {
        console.log(err);
      }
    })
  }

  deteleEmployee(id:number){
    this._empService.deleteEmployee(id).subscribe({
      next:(res)=>{
        //alert("Employee deleted!");
        this._coreService.openSnackBar('Employee deleted!', 'done');
        this.getEmployeeList();
      },
      error: console.log
    })
  }

  openEditForm(data){
    const DialogRef = this._dialog.open(EmpAddEditComponent, {
      data,
    });

    DialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getEmployeeList();
        }
      }
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
