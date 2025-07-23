import { useParams } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';
import { useBackNavigation } from '../../hooks/useBackNavigation';
import styles from './BookingForm.module.css';

export default function BookingForm() {
  const { roomId, bookingId } = useParams<{ roomId: string; bookingId?: string }>();

  const {
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    description,
    setDescription,
    loading,
    error,
    saveBooking,
  } = useBooking(roomId!, bookingId);

  const goBack = useBackNavigation(`/meeting-rooms/${roomId}/bookings`);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await saveBooking();
    if (success) {
      goBack();
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.header}>
          <button type="button" onClick={goBack} className={styles.backButton}>
            ← Назад
          </button>
          <h1 className={styles.title}>
            {bookingId ? 'Редагувати бронювання' : 'Створити бронювання'}
          </h1>
          <div className={styles.spacer} />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <label htmlFor="startTime" className={styles.label}>Початок</label>
        <input
          id="startTime"
          type="datetime-local"
          value={startTime}
          onChange={e => setStartTime(e.target.value)}
          className={styles.input}
          required
        />

        <label htmlFor="endTime" className={styles.label}>Кінець</label>
        <input
          id="endTime"
          type="datetime-local"
          value={endTime}
          onChange={e => setEndTime(e.target.value)}
          className={styles.input}
          required
        />

        <label htmlFor="description" className={styles.label}>Опис</label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className={styles.textarea}
          rows={4}
          placeholder="Додайте опис бронювання (необов’язково)"
        />

        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? 'Збереження...' : 'Зберегти'}
        </button>
      </form>
    </div>
  );
}
