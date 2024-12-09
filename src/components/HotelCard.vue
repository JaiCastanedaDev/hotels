<template>
    <div class="hotel-card">
      <h3>{{ hotel.name }}</h3>
      <p>{{ hotel.address }}</p>
      <p>{{ hotel.city }}</p>
      <button @click="$emit('edit')">Editar</button>
      <button @click="$emit('delete', hotel.id)">Eliminar</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      hotel: Object,
    },
  };
  </script>
  