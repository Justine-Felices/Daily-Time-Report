const url = "https://vzwjdbpwcpsrdwndijvx.supabase.co/rest/v1/attendance_entries?limit=1";
const key = "sb_publishable_e3Stz5P53B0xCQlvY65RUg_z5xkq8tx";

async function run() {
  try {
    const res = await fetch(url, {
      headers: {
        "apikey": key,
        "Authorization": `Bearer ${key}`
      }
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response text:", text.slice(0, 1000));
  } catch (e) {
    console.error("Error:", e);
  }
}

run();
