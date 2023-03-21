import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, getDocs,
	onSnapshot, addDoc, doc,
	query, where,
	updateDoc
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

// queries
const qCompleted = query(colRef, where("appear", "==", true))
const qBinding = query(colRef, where("appear", "==", false))

// get real time collection data
// onSnapshot(colRef, (snapshot) => {
// 	snapshot.docs.forEach(doc => {
// 		coaches.push({ ...doc.data(), id: doc.id })
// 	})
// 	console.log(coaches)
// 	fillHTML()
// })

// get collection data
let completedCoaches = []
getDocs(qCompleted)
  .then(snapshot => {
    // console.log(snapshot.docs)
    snapshot.docs.forEach(doc => {
      completedCoaches.push({ ...doc.data(), id: doc.id })
    })
		fillHTML(completedCoaches, true)
  })
  .catch(err => {
    console.log(err.message)
  })

// get collection data
let inCompletedcoaches = [];
getDocs(qBinding)
  .then(snapshot => {
    // console.log(snapshot.docs)
    snapshot.docs.forEach(doc => {
      inCompletedcoaches.push({ ...doc.data(), id: doc.id })
    })
		fillHTML(inCompletedcoaches, false)
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
let bindingContent = document.querySelector('.binding .container');
coachesContent.innerHTML = '';
bindingContent.innerHTML = '';
function fillHTML(coaches, completed = true) {
	coaches.forEach(coach => {
		if(completed) {
			coachesContent.innerHTML += `
				<article class="coach">
					<h2 class="name">${coach.name}</h2>
					<span class="job-title">${coach.jobTitle}</span>
					<p class="job-desc">${coach.jobDesc ? coach.jobDesc : "No Description Yet"}</p>
				</article>
			`
		} else {
			bindingContent.innerHTML += `
				<article class="coach">
					<h2 class="name">${coach.name}</h2>
					<span class="job-title">${coach.jobTitle}</span>
					<p class="job-desc">${coach.jobDesc ? coach.jobDesc : "No Description Yet"}</p>
					<button class="approve-btn" data-id="${coach.id}">Approve</button>
				</article>
			`
		}
	});
	console.log(coaches)
}

window.onload = () => {
	setTimeout(() => {
		document.querySelectorAll('.approve-btn').forEach(btn => {
			btn.addEventListener('click', (e) => {
				// update(e.target.dataset.id)
				update(e.target)
			})
		})
	}, 200);
}

// Doc Updating 
function update(element) {
	console.log(element)
	let docRef = doc(db, 'coaches', element.dataset.id)

  updateDoc(docRef, {
    appear: true
  })
  .then(() => {
		element.parentElement.classList.add("updated");
  })
}