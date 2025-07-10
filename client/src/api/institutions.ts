export async function fetchInstitutions() {
  const response = await fetch("http://localhost:5000/api/institutions");
  if (!response.ok) throw new Error("Failed to fetch institutions");
  return await response.json();
}

export async function addInstitution(data: any) {
  const response = await fetch("http://localhost:5000/api/institutions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      status: data.status.toUpperCase(), // ✅ ensure it's "ACTIVE" or "INACTIVE"
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to add institution");
  }

  return response.json();
}

export async function updateInstitution(id: number, data: any) {
  const res = await fetch(`http://localhost:5000/api/institutions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update institution");
  }

  return res.json();
}


