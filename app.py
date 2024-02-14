from flask import (
    Flask,
    render_template,
    request,
    redirect,
    url_for,
    send_from_directory,
)
import os
import random
from datetime import datetime

app = Flask(__name__)

AUDIO_FOLDER = os.path.join(os.getcwd(), "audio_files")
if not os.path.exists(AUDIO_FOLDER):
    os.makedirs(AUDIO_FOLDER)


@app.route("/")
def index():
    # List existing audio files
    audio_files = os.listdir(AUDIO_FOLDER)
    audio_files = [file for file in audio_files if file.endswith(".wav")]
    # random.shuffle(audio_files)
    return render_template("index.html", audio_files=audio_files)


@app.route("/upload", methods=["POST"])
def upload():
    if request.method == "POST":
        audio = request.files["audio_data"]
        if audio:
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            filename = f"recording_{timestamp}.wav"
            audio.save(os.path.join(AUDIO_FOLDER, filename))
            return redirect(url_for("index"))
    return "Something went wrong!"


@app.route("/audio_files/<filename>")
def uploaded_file(filename):
    return send_from_directory(AUDIO_FOLDER, filename)


if __name__ == "__main__":
    app.run(debug=True)
