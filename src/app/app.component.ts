import { Component, ViewChild } from '@angular/core';
import * as jspdf from 'jspdf';
import * as html2canvas from 'html2canvas';
import { HttpClient } from "@angular/common/http";
import 'jspdf-autotable';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})


export class AppComponent {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  private signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 5,
    'canvasWidth': 500,
    'canvasHeight': 300
  };

  title = 'pdfapp';
  

  constructor(public http: HttpClient){}

  async convertTableToPDF(){
    let data = document.getElementById('tableData');
  
  
      (html2canvas as any)(data, {onclone: function (loaded){} 
        }).then(canvas =>{

      let id = Math.random().toPrecision(1);

      let imgWidth = 300;
      let pageHeight = 295;
      let imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      const contentDataURL =  canvas.toDataURL('image/png'); 
      let pdf = new jspdf('p', 'mm', 'a4');
      let position = 70;

      
      // pdf.addImage(contentDataURL, 'PNG',10,position,imgWidth,imgHeight);
      pdf.autoTable({html: '#tableData', startY: 70, theme:'grid'});
      pdf.page=1;

      var img = new Image();
      img.src = 'assets/Capture.PNG';
      pdf.addImage(img, 'PNG', 10, 10, imgWidth-120, 30);
      
      pdf.setFontSize(12)
      pdf.text(130, 270, 'Signature: ')
      pdf.text(157, 270, '...................')
      pdf.addImage(this.signaturePad.toDataURL(), 'PNG', 150, 260, 50, 20);
      pdf.line(0, 275, 275, 275);
      pdf.text(80, 285, 'crystaltours.com')
      pdf.text(150,285, 'page ' + pdf.page);
      
      pdf.save('Invoice'+id+'-'+Date.now()+'.pdf');

      let data = pdf.output('blob');

    
      if(data){
      console.log(data);
      
      const formData: FormData = new FormData();
      formData.append('sampleFile', data, 'Invoice'+id+'-'+Date.now());
      

     let response = this.http.post('http://localhost:3000/api/files', formData);

     response.subscribe((response)=>{
       console.log(response);
     })

    }else{

    }

      //window.open(data);
      


   }
   
  )     
}
ngAfterViewInit() {
  // this.signaturePad is now available
  this.signaturePad.set('minWidth', 1); // set szimek/signature_pad options at runtime
  this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
}

complete() {
  // will be notified of szimek/signature_pad's onEnd event
  console.log(this.signaturePad.toDataURL());
  this.debugBase64(this.signaturePad.toDataURL());
}
refresh(){
  this.signaturePad.clear();
}

drawStart() {
  // will be notified of szimek/signature_pad's onBegin event
  console.log('begin drawing');
}
debugBase64(base64URL){
  var win = window.open();
  win.document.write('<iframe src="' + base64URL  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
}
}
