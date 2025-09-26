export const getUpdateColor = (type: string) => {
  switch (type) {
    case 'warning':
      return 'border-l-yellow-500';
    case 'delay':
      return 'border-l-red-500';
    case 'success':
      return 'border-l-green-500';
    default:
      return 'border-l-blue-500';
  }
};

export const getStatusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    scheduled: 'bg-green-500/20 text-green-400 border-green-500/30',
    delayed: 'bg-red-500/20 text-red-400 border-red-500/30',
    departed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    arrived: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    cancelled: 'bg-destructive/20 text-destructive border-destructive/30',
  };
  return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
};

export const getStatusText = (status: string) => {
  const texts: { [key: string]: string } = {
    scheduled: 'За розкладом',
    delayed: 'Затримка',
    departed: 'Відправився',
    arrived: 'Прибув',
    cancelled: 'Скасовано',
  };
  return texts[status] || status;
};

export const getTrainTypeText = (type: string) => {
  const types: { [key: string]: string } = {
    high_speed: 'Швидкісний',
    intercity: 'Інтерсіті',
    regional: 'Регіональний',
    local: 'Приміський',
  };
  return types[type] || type;
};

export const formatTime = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getTypeColor = (type: string) => {
  switch (type) {
    case 'high_speed':
      return 'bg-red-500/20 text-red-400';
    case 'intercity':
      return 'bg-blue-500/20 text-blue-400';
    case 'regional':
      return 'bg-green-500/20 text-green-400';
    case 'local':
      return 'bg-gray-500/20 text-gray-400';
    default:
      return 'bg-gray-500/20 text-gray-400';
  }
};

export const getTypeText = (type: string) => {
  switch (type) {
    case 'high_speed':
      return 'Швидкісний';
    case 'intercity':
      return 'Міжміський';
    case 'regional':
      return 'Регіональний';
    case 'local':
      return 'Приміський';
    default:
      return type;
  }
};

export const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin':
      return 'bg-red-500/20 text-red-400';
    case 'user':
      return 'bg-green-500/20 text-green-400';
    default:
      return 'bg-gray-500/20 text-gray-400';
  }
};

export const getRoleText = (role: string) => {
  switch (role) {
    case 'admin':
      return 'Адміністратор';
    case 'user':
      return 'Користувач';
    default:
      return role;
  }
};
