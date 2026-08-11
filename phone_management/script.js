// script.js - Simple Phone Management Dashboard

// Elements
const addPhoneBtn = document.getElementById('addPhoneBtn');
const phonesTableBody = document.querySelector('#phonesTable tbody');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const phoneForm = document.getElementById('phoneForm');
const phoneIdInput = document.getElementById('phoneId');
const phoneNameInput = document.getElementById('phoneName');
const phoneModelInput = document.getElementById('phoneModel');
const phoneStatusSelect = document.getElementById('phoneStatus');

// Utility: generate simple incremental ID
function generateId() {
  return Date.now().toString();
}

// Load phones from localStorage
function loadPhones() {
  const data = localStorage.getItem('phones');
  return data ? JSON.parse(data) : [];
}

function savePhones(phones) {
  localStorage.setItem('phones', JSON.stringify(phones));
}

function renderPhones() {
  const phones = loadPhones();
  phonesTableBody.innerHTML = '';
  phones.forEach(phone => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${phone.id}</td>
      <td>${phone.name}</td>
      <td>${phone.model}</td>
      <td>${phone.status}</td>
      <td>
        <button class="btn primary" data-action="edit" data-id="${phone.id}">Edit</button>
        <button class="btn danger" data-action="delete" data-id="${phone.id}">Delete</button>
        <button class="btn" data-action="toggle" data-id="${phone.id}">Toggle Status</button>
      </td>
    `;
    phonesTableBody.appendChild(tr);
  });
}

function openModal(isEdit = false, phone = null) {
  modal.classList.remove('hidden');
  if (isEdit && phone) {
    modalTitle.textContent = 'Edit Phone';
    phoneIdInput.value = phone.id;
    phoneNameInput.value = phone.name;
    phoneModelInput.value = phone.model;
    phoneStatusSelect.value = phone.status;
  } else {
    modalTitle.textContent = 'Add Phone';
    phoneIdInput.value = '';
    phoneForm.reset();
  }
}

function closeModalFn() {
  modal.classList.add('hidden');
}

function getPhoneById(id) {
  return loadPhones().find(p => p.id === id);
}

// Event Listeners
addPhoneBtn.addEventListener('click', () => openModal());
closeModal.addEventListener('click', closeModalFn);
window.addEventListener('click', e => { if (e.target === modal) closeModalFn(); });

phoneForm.addEventListener('submit', e => {
  e.preventDefault();
  const id = phoneIdInput.value || generateId();
  const newPhone = {
    id,
    name: phoneNameInput.value.trim(),
    model: phoneModelInput.value.trim(),
    status: phoneStatusSelect.value,
  };
  let phones = loadPhones();
  const existingIndex = phones.findIndex(p => p.id === id);
  if (existingIndex >= 0) {
    phones[existingIndex] = newPhone; // update
  } else {
    phones.push(newPhone); // add
  }
  savePhones(phones);
  renderPhones();
  closeModalFn();
});

phonesTableBody.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  const phones = loadPhones();
  if (action === 'edit') {
    const phone = getPhoneById(id);
    if (phone) openModal(true, phone);
  } else if (action === 'delete') {
    const filtered = phones.filter(p => p.id !== id);
    savePhones(filtered);
    renderPhones();
  } else if (action === 'toggle') {
    const phone = getPhoneById(id);
    if (phone) {
      phone.status = phone.status === 'online' ? 'offline' : 'online';
      savePhones(phones);
      renderPhones();
    }
  }
});

// Initial render
renderPhones();
