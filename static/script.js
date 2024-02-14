let mediaRecorder;
let audioChunks = [];

document.getElementById("recordBtn").onclick = function () {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    this.innerHTML = '<i class="bi bi-record-circle"></i>';
  } else {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("audio_data", audioBlob, "recording.wav");
        fetch("/upload", {
          method: "POST",
          body: formData,
        }).then((response) => {
          console.log(response);
          audioChunks = []; // Clear the chunks array
          window.location.reload();
        });
      };
      mediaRecorder.start();
      this.innerHTML = '<i class="bi bi-stop-circle"></i>';
    });
  }
};

function playAudio(fileList) {
  // let files = JSON.parse(fileList); // Parse the JSON string into an array
  let index = 0;

  function playNextFile() {
    if (index < fileList.length) {
      const audio = new Audio(`/audio_files/${fileList[index]}`);
      audio.play();
      index++;
      audio.onended = playNextFile; // Play the next file when this one ends
    }
  }

  playNextFile(); // Start playing the first file
}
