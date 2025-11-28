  // cloudinary config
  // storage
  const CLOUD_NAME = "dlpkbvsqx";
  const UPLOAD_PRESET = "lounges_images";

// Initialize firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, doc, serverTimestamp, query, orderBy, getDocs, getDoc }
from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDsAsM12uYeoXYeQASWhBOF2kybHB6xSb8",
    authDomain: "hirasakoweek.firebaseapp.com",
    // databaseURL: "https://hirasakoweek-default-rtdb.firebaseio.com",
    projectId: "hirasakoweek",
    // storageBucket: "hirasakoweek.firebasestorage.app",
    // messagingSenderId: "826682152768",
    // appId: "1:826682152768:web:e9fc99105c5b0b03e60ca5"
  };

  // v8 Reference database
//   const hirasakoweekDB = firebase.database().ref("hirasakoweek");

// Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // generate device ID
  function getDeviceId() {
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem("deviceId", deviceId);
    }
    return deviceId;
  }

  const deviceId = getDeviceId();
  
  // random profile pfps
  const profilePics = [
  "https://res.cloudinary.com/dlpkbvsqx/image/upload/pfp1_tudqom.png",
  "https://res.cloudinary.com/dlpkbvsqx/image/upload/pfp2_nv24q2.png",
  "https://res.cloudinary.com/dlpkbvsqx/image/upload/pfp3_f0o7l4.png",
  "https://res.cloudinary.com/dlpkbvsqx/image/upload/pfp4_glmhta.png"
];

  // upload url

  // Form submit listener
  document.getElementById("form").addEventListener("submit", submitForm);

  //Alert element
  const alertBox = document.querySelector(".alert");
  alertBox.style.display = "none";

  // Popup handling
const popup = document.querySelector(".popup");
const showBtn = document.querySelector("#show");
const closeBtn = popup.querySelector(".close-btn");

// Show the popup
showBtn.addEventListener("click", (e) => {
    popup.classList.add("active");
    e.stopPropagation(); // prevent document click from immediately closing
});

// Close button
closeBtn.addEventListener("click", () => {
    popup.classList.remove("active");
});

// Prevent clicks inside the popup from closing it
popup.addEventListener("click", (e) => {
    e.stopPropagation();
});

// Click anywhere else closes the popup
document.addEventListener("click", () => {
    popup.classList.remove("active");
});

  // submit form
  async function submitForm(e) {
    e.preventDefault();

    const submitBtn = document.getElementById("submit-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Waiting...";
    submitBtn.style.backgroundColor = "#ccc";
    submitBtn.style.cursor = "not-allowed";

    const nameField = document.getElementById("name-field");
    const captionField = document.getElementById("caption-field");
    const categoryField = document.getElementById("category-field");
    const imageInput = document.getElementById("imageUpload-field");

    const nameError = document.getElementById("name-error");
    const captionError = document.getElementById("caption-error");
    const categoryError = document.getElementById("category-error");
    const imageError = document.getElementById("imageUpload-error");

    // Reset errors
    nameError.textContent = "";
    captionError.textContent = "";
    categoryError.textContent = "";
    imageError.textContent = "";
    alertBox.style.display = "none";

    const name = nameField.value.trim();
    const caption = captionField.value.trim();
    const category = categoryField.value.trim();
    const imageFile = imageInput.files[0];

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"];

    let hasError = false;

    if (!name) {
        nameError.textContent = "Please enter your name.";
        hasError = true;
    }

    if (!caption) {
        captionError.textContent = "Please enter a caption.";
        hasError = true;
    }

    if (!category) {
        categoryError.textContent = "Please choose a game category.";
        hasError = true;
    }

    if (!imageFile) {
        imageError.textContent = "Please upload an image.";
        hasError = true;
    } else if (!allowedTypes.includes(imageFile.type)) {
        imageError.textContent = "Invalid file type! Only JPG, JPEG, PNG, WebP, SVG allowed.";
        hasError = true;
    }

    if (hasError) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send";
        submitBtn.style.backgroundColor = "";
        submitBtn.style.cursor = "";
        return;
    } 

    const randomPfp = profilePics[Math.floor(Math.random() * profilePics.length)];

    try {
        // Upload to Cloudinary
        const imageUrl = await uploadToCloudinary(imageFile);

        // Save to Firestore
        const docRef = await addDoc(collection(db, "loungePosts"), {
            name,
            caption,
            category,
            imageUrl,
            profilePic: randomPfp,
            deviceId,
            likes: [],
            timestamp: serverTimestamp()
        });

        // Reset form
        document.getElementById("form").reset();

        // Show success
        alertBox.style.display = "block";
        setTimeout(() => alertBox.style.display = "none", 3000);

        loadPosts(); // reload posts after new submission

        // close popup once data successfully sent
        popup.classList.remove("active");

    } catch (err) {
        console.error(err);
        alert("Error uploading. Try again.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send";
        submitBtn.style.backgroundColor = "";
        submitBtn.style.cursor = "";
    }
}

// Upload to Cloudinary (unsigned)
async function uploadToCloudinary(imageFile) {
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(url, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        throw new Error("Cloudinary upload failed");
    }

    const data = await response.json();
    return data.secure_url; // return image URL
}

// var nameLabel = document.getElementById("name-label");
// var nameField = document.getElementById("name-field");
// var nameError = document.getElementById("name-error");

// var captionLabel = document.getElementById("caption-label");
// var captionField = document.getElementById("caption-field");
// var captionError = document.getElementById("caption-error");

// var imageLabel = document.getElementById("imageUpload-label");
// var imageField = document.getElementById("imageUpload-field");
// var imageError = document.getElementById("imageUpload-error");

// const form = popup.querySelector("form");

// form.addEventListener("submit", (e) => {
//     // Stop submission if any field is empty
//     if (!validateName() || !validateCaption() || !validateImage()) {
//         e.preventDefault();
//     }
// });


const categoryColors = {
    "Memory Game": "#ff9f43",
    "Maze": "#10ac84",
    "Sliding Puzzle": "#e52a2aff",
    "Word Search": "#341f97",
    "Others": "#9925b9ff"
};

// display post from firestore
async function loadPosts() {
    const postsContainer = document.getElementById("posts-container");
  postsContainer.innerHTML = ""; // clear before inserting

  const q = query(collection(db, "loungePosts"), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const postId = docSnap.id;
    const timestamp = data.timestamp ? data.timestamp.toDate() :newDate();
    const localTime = timestamp.toLocaleString();
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");

    postDiv.innerHTML = `
    <div class="post-card">
        <div class="post-header">
            <div class="post-user">
                <img src="${data.profilePic || 'https://via.placeholder.com/25'}" alt="Profile" class="post-pfp">
                <h3 class="post-name">${data.name}</h3>
            </div>
            <span class="category-tag" 
                style="background-color: ${categoryColors[data.category] || '#aaa'}">
                ${data.category}
            </span>
        </div>
        <img src="${data.imageUrl || 'https://via.placeholder.com/200'}" alt="Post Image" class="post-image">
        <div class="post-content">
            <p>${data.caption}</p>
            <div class="post-meta">
                <small class="post-timestamp">${localTime}</small>
            </div>
            <div class="post-actions">
                <button class="like-btn" data-id="${postId}">
                    <i class="${data.likes.includes(deviceId) ? "ri-heart-fill" : "ri-heart-line"} heart-icon"></i>
                    <span class="like-count">${data.likes.length}</span>
                </button>
            </div>
        </div>
    </div>
`;

    postsContainer.appendChild(postDiv);

    const likeBtn = postDiv.querySelector(".like-btn");
    likeBtn.addEventListener("click", async () => {
    likeBtn.disabled = true;
    await likePost(postId, likeBtn);
    likeBtn.disabled = false;
});
    });
}

// Like a post
async function likePost(postId, btn) {
    try {
        const postRef = doc(db, "loungePosts", postId);
        const postSnap = await getDoc(postRef);
        const postData = postSnap.data();

        let likes = postData.likes || [];

        const heart = btn.querySelector(".heart-icon");
        const count = btn.querySelector(".like-count");

        if (!likes.includes(deviceId)) {
            likes.push(deviceId);
            heart.classList.add("liked");
        } else {
            likes = likes.filter(id => id !== deviceId);
            heart.classList.remove("liked");
        }

        await updateDoc(postRef, { likes });

        btn.querySelector(".heart-icon").className = likes.includes(deviceId) ? "ri-heart-fill heart-icon" : "ri-heart-line heart-icon"

        //count.textContent = likes.length

        // const likeCount = btn.querySelector(".like-count");
        // if (likeCount) likeCount.textContent = likes.length;

        btn.querySelector(".like-count").textContent = likes.length;
        // btn.textContent = `${likes.includes(deviceId) ? 'Unlike' : 'Like'} `;
        // btn.appendChild(likeCount);
    } catch (err) {
        console.error("Error liking post:", err);
    }
}

// Initial load
loadPosts();


// function validateName() {
//     if (!nameField.value.trim()) { // check if empty
//         nameError.innerHTML = "Please enter a name";
//         nameField.style.borderColor = "red";
//         return false;
//     }
//     nameError.innerHTML = "";
//     nameField.style.borderColor = "green";
//     return true;
// }

// function validateCaption() {
//     if (!captionField.value.trim()) {
//         captionError.innerHTML = "Please enter a caption";
//         captionField.style.borderColor = "red";
//         return false;
//     }
//     captionError.innerHTML = "";
//     captionField.style.borderColor = "green";
//     return true;
// }

// function validateImage() {
//     if (!imageField.files.length) { // check if a file is selected
//         imageError.innerHTML = "Please upload an image";
//         imageField.style.borderColor = "red";
//         return false;
//     }
//     imageError.innerHTML = "";
//     imageField.style.borderColor = "green";
//     return true;
// }
