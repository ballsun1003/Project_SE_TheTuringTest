// hash.js
import bcrypt from "bcryptjs";

async function main() {
  const password = "tttttt";
  const hash = await bcrypt.hash(password, 10);
  console.log("hash:", hash);
}

main();
