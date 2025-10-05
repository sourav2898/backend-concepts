// reading / weiting binary files
const fs = require("fs");

// Reading an image file
fs.readFile("image.png", (err, buffer) => {
  console.log(buffer); // <Buffer 89 50 4e 47 0d 0a 1a 0a ...>
  console.log(buffer.length); // Size in bytes

  // Modify and write back
  fs.writeFile("image-copy.png", buffer, (err) => {
    console.log("Image copied successfully");
  });
});

// Reading with encoding (converts buffer to string)
fs.readFile("document.txt", "utf8", (err, data) => {
  console.log(data); // String content
});

// streming larger files
// Streaming a video file
const readStream = fs.createReadStream("movie.mp4");
const writeStream = fs.createWriteStream("movie-copy.mp4");

readStream.on("data", (chunk) => {
  // Each chunk is a Buffer
  console.log(`Received ${chunk.length} bytes`);
  writeStream.write(chunk);
});

readStream.on("end", () => {
  console.log("Streaming complete");
  writeStream.end();
});

// Or simply:
readStream.pipe(writeStream);

// Network Opertaions TCP/HTTP
const net = require("net");

// TCP Server receiving binary data
const server = net.createServer((socket) => {
  socket.on("data", (buffer) => {
    console.log("Received buffer:", buffer);
    console.log("As string:", buffer.toString());

    // Echo back
    socket.write(buffer);
  });
});

server.listen(3000);

// Image Processing
const sharp = require("sharp"); // popular image processing library

// Resize an image
fs.readFile("large-image.jpg", (err, buffer) => {
  sharp(buffer)
    .resize(300, 200)
    .toBuffer()
    .then((resizedBuffer) => {
      fs.writeFile("thumbnail.jpg", resizedBuffer, (err) => {
        console.log("Thumbnail created");
      });
    });
});

// Cryptography / Hashing
const crypto = require("crypto");

// Creating a hash
const buffer = Buffer.from("secret password");
const hash = crypto.createHash("sha256").update(buffer).digest();
console.log("Hash:", hash.toString("hex"));

// Encryption
const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const cipher = crypto.createCipheriv(algorithm, key, iv);
let encrypted = cipher.update("sensitive data", "utf8", "hex");
encrypted += cipher.final("hex");

console.log("Encrypted:", encrypted);

// Protocol Implementation
// Example: Creating a simple binary protocol packet
function createPacket(type, data) {
  const dataBuffer = Buffer.from(data);
  const packet = Buffer.allocUnsafe(5 + dataBuffer.length);

  packet.writeUInt8(type, 0); // 1 byte: packet type
  packet.writeUInt32BE(dataBuffer.length, 1); // 4 bytes: data length
  dataBuffer.copy(packet, 5); // actual data

  return packet;
}

const packet = createPacket(1, "Hello World");
console.log(packet);

// Parsing the packet
function parsePacket(buffer) {
  const type = buffer.readUInt8(0);
  const length = buffer.readUInt32BE(1);
  const data = buffer.slice(5, 5 + length).toString();

  return { type, length, data };
}

console.log(parsePacket(packet));

//   Database operations
const { MongoClient } = require("mongodb");

// Storing binary data (like profile pictures) in MongoDB
async function storeProfilePicture(userId, imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);

  await db
    .collection("users")
    .updateOne({ _id: userId }, { $set: { profilePicture: imageBuffer } });
}

// Retrieving and serving
async function getProfilePicture(userId) {
  const user = await db.collection("users").findOne({ _id: userId });
  return user.profilePicture; // Returns a Buffer
}

// Multi form data file uploads
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("file"), (req, res) => {
  // req.file.buffer contains the file as a Buffer
  const fileBuffer = req.file.buffer;

  // Process or save the buffer
  fs.writeFile(`uploads/${req.file.originalname}`, fileBuffer, (err) => {
    res.send("File uploaded successfully");
  });
});
