import React, { useState } from 'react';
import useReviewsStore from '../../store/useReviewsStore';

const ReviewsView = () => {
  const { reviews, addReview } = useReviewsStore();
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    addReview({
      id: Date.now(),
      name,
      text,
      date: "Только что"
    });

    setName('');
    setText('');
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="font-black text-2xl uppercase italic tracking-wider text-white mb-2 pl-2">
        Отзывы
      </h2>

      {/* Форма добавления */}
      <form onSubmit={handleSubmit} className="inner-glass p-4 rounded-2xl border border-white/20 flex flex-col gap-2">
        <input
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-white/40 border border-white/20 rounded-xl p-2 text-slate-900 placeholder-slate-500 outline-none text-sm"
        />

        <textarea
          placeholder="Текст отзыва..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="bg-white/40 border border-white/20 rounded-xl p-2 text-slate-900 placeholder-slate-500 outline-none text-sm h-20 resize-none"
        />
        <button
          type="submit"
          className="bg-accent-purple text-white font-bold py-2 rounded-xl text-sm shadow-lg active:scale-95 transition-transform"
        >
          Опубликовать
        </button>
      </form>

      {/* Список отзывов */}
      {reviews.map((review) => (
        <div key={review.id} className="inner-glass p-5 rounded-2xl border border-white/20 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <div className="font-black text-[12px] uppercase italic tracking-wider text-slate-900">
              {review.name}
            </div>
            <span className="text-[10px] font-bold text-slate-500/80">
              {review.date}
            </span>
          </div>
          <p className="text-slate-800 text-[14px] font-medium leading-snug">
            {review.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReviewsView;