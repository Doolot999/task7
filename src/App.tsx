import React, { useState, useEffect } from 'react';

interface Ad {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url: string;
}

function App() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = 'https://inai-col1.fishrungames.com/ads';

  // Получение списка объявлений (GET)
  const fetchAds = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Ошибка при загрузке объявлений');
      const data = await res.json();
      setAds(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  // Отправка нового объявления (POST multipart/form-data)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !price || !image) {
      alert('Заполни все поля и выбери картинку!');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('image', image);

    setLoading(true);
    setError('');

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Ошибка при создании объявления');

      // Очищаем форму и обновляем список
      setTitle('');
      setDescription('');
      setPrice('');
      setImage(null);
      fetchAds();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      <h1>Доска объявлений (Задание 7)</h1>

      {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}

      {/* Форма добавления */}
      <form onSubmit={handleSubmit} style={{ background: '#f4f4f4', padding: '15px', marginBottom: '20px', borderRadius: '8px' }}>
        <h3>Создать объявление</h3>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <textarea
            placeholder="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="number"
            placeholder="Цена"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && setImage(e.target.files[0])}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          {loading ? 'Отправка...' : 'Добавить объявление'}
        </button>
      </form>

      {/* Список объявлений */}
      <h2>Список объявлений</h2>
      <div style={{ display: 'grid', gap: '15px' }}>
        {Array.isArray(ads) && ads.length > 0 ? (
          ads.map((ad) => (
            <div key={ad.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', display: 'flex', gap: '15px' }}>
              {ad.image_url && (
                <img src={ad.image_url} alt={ad.title} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '4px' }} />
              )}
              <div>
                <h4>{ad.title}</h4>
                <p>{ad.description}</p>
                <p><strong>Цена:</strong> {ad.price} сом</p>
              </div>
            </div>
          ))
        ) : (
          <p>Пока нет объявлений или загрузка...</p>
        )}
      </div>
    </div>
  );
}

export default App;