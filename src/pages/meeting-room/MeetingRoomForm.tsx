import { useMeetingRoomForm } from '../../hooks/useMeetingRoomForm';

export default function MeetingRoomForm() {
  const {
    id,
    name,
    setName,
    description,
    setDescription,
    loading,
    error,
    handleSubmit,
    navigate,
  } = useMeetingRoomForm();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-lg mb-6 flex items-center">
        <button
          type="button"
          onClick={() => navigate('/meeting-rooms')}
          className="text-blue-400 hover:text-blue-600 font-semibold"
        >
          ← Назад
        </button>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-gray-800 p-8 rounded-xl shadow-lg text-white"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          {id ? 'Редагувати кімнату' : 'Створити кімнату'}
        </h1>

        {error && (
          <p className="mb-6 text-center text-red-500 font-semibold">{error}</p>
        )}

        <label htmlFor="name" className="block mb-2 font-semibold">
          Назва
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-white"
          required
          autoFocus
        />

        <label htmlFor="description" className="block mb-2 font-semibold">
          Опис
        </label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={5}
          className="w-full mb-8 px-4 py-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-white resize-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 py-3 rounded-md font-semibold transition"
        >
          {loading ? 'Збереження...' : 'Зберегти'}
        </button>
      </form>
    </div>
  );
}
