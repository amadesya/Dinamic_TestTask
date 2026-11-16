import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatePlaceholder } from '../../components/common/StatePlaceholder';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '48px 0' }}>
      <StatePlaceholder
        variant="not-found"
        title="404 — Страница не найдена"
        description="Запрашиваемая вами страница не существует, была перемещена или удалена."
        actionText="Вернуться на главную"
        onAction={() => navigate('/')}
      />
    </div>
  );
};

export default NotFoundPage;
