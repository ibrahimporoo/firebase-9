import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, getDocs,
	onSnapshot, addDoc
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDnpUv6FkAyt3eGai3AtCm65exvwFwvOyE",
  authDomain: "collection-practice.firebaseapp.com",
  projectId: "collection-practice",
  storageBucket: "collection-practice.appspot.com",
  messagingSenderId: "1054284320639",
  appId: "1:1054284320639:web:5ad00474d208b0c1eed44a"
};

// init firebase
initializeApp(firebaseConfig)

// init services
const db = getFirestore()

// collection ref
const colRef = collection(db, 'coaches')

// get real time collection data
// onSnapshot(colRef, (snapshot) => {
// 	snapshot.docs.forEach(doc => {
// 		coaches.push({ ...doc.data(), id: doc.id })
// 	})
// 	console.log(coaches)
// 	fillHTML()
// })

// get collection data
let coaches = []
getDocs(colRef)
  .then(snapshot => {
    // console.log(snapshot.docs)
    snapshot.docs.forEach(doc => {
      coaches.push({ ...doc.data(), id: doc.id })
    })
		fillHTML()
  })
  .catch(err => {
    console.log(err.message)
  })


// Registering
const registerForm = document.querySelector('.register');
registerForm.addEventListener('submit', (e) => {
	e.preventDefault();
	addDoc(colRef, {
		name: registerForm.name.value,
		jobTitle: registerForm.jobTitle.value,
		jobDesc: registerForm.jobDesc.value,
		appear: false
	})
	.then( _ => registerForm.reset())
})

let coachesContent = document.querySelector('.coaches-content .container');
function fillHTML() {
	let html = ''
	coaches.forEach(coach => {
		if(coach.appear == true) {
			html += `
				<article class="coach">
					<h2 class="name">${coach.name}</h2>
					<span class="job-title">${coach.jobTitle}</span>
					<p class="job-desc">${coach.jobDesc ? coach.jobDesc : "No Description Yet"}</p>
				</article>
			`
		} else {
			console.log("Not True")
		}
	});
	coachesContent.innerHTML = html;
}





