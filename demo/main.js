/*import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);*/

function addImage() {
	const files = document.getElementById('imageupload').files;
	const images = document.getElementById('images');
	if (!files.length) {
	    images.innerHTML = "<p>No files selected!</p>";
	} else {
	    images.innerHTML = "";
	    for (let i = 0; i < files.length; i++) {
	    	const div = document.createElement("div");
	        div.setAttribute("id","imgForm" + i);
	        div.style.margin = "5px 10px 5px 0px";
	        div.style.border = "thick solid #004c3f"
	        images.appendChild(div);
	        const img = document.createElement("img");
	        img.height=200
	        img.src = URL.createObjectURL(files[i]);
	        img.onload = function() {
	        	URL.revokeObjectURL(this.src);
	      	}
	      	img.setAttribute("id", "image" + i);
	      	div.appendChild(img);
	      	const optionDiv = document.createElement("div");
	      	div.appendChild(optionDiv);
	      	/*const privateL = document.createElement("label");
	      	const private = document.createElement("input");
	      	private.type="radio";
	      	private.name="access" + i;
	      	private.id = "private" + i;
	      	private.setAttribute("id","private" + i);
	      	optionDiv.appendChild(privateL);
	      	privateL.appendChild(private);
	      	privateL.appendChild(document.createTextNode("Private"));
	      	optionDiv.appendChild(document.createElement("br"));
	      	const publicL = document.createElement("label");
	      	const public= document.createElement("input");
	      	public.type="radio";
	      	public.name="access" + i;
	      	public.id = "public" + i;
	      	public.setAttribute("id","public" + i);
	      	optionDiv.appendChild(publicL);
	      	publicL.appendChild(public);
	      	publicL.appendChild(document.createTextNode("Public"));*/
	    }
	}
}