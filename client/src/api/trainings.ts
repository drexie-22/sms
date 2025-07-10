// src/api/trainings.ts

export async function getTrainings() {
  const res = await fetch("http://localhost:5000/api/trainings");
  if (!res.ok) throw new Error("Failed to fetch trainings");
  return res.json();
}

export async function addTraining(data: any) {
  const res = await fetch("http://localhost:5000/api/trainings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add training");
  return res.json();
}

export async function getGADCount() {
  const res = await fetch("http://localhost:5000/api/trainings/gad-count");
  if (!res.ok) throw new Error("Failed to fetch GAD count");
  return res.json();
}

export async function fetchTrainings() {
  const res = await fetch("http://localhost:5000/api/trainings"); // or your deployed URL
  if (!res.ok) {
    throw new Error("Failed to fetch trainings");
  }
  return res.json();
}

export async function fetchGADTrainings() {
  const res = await fetch("http://localhost:5000/api/trainings");
  if (!res.ok) throw new Error("Failed to fetch trainings");
  const data = await res.json();
  return data.filter((t: any) => t.female > 0 || t.others > 0);
}



