import { useState } from 'react';
import { CheckCircle2, Circle, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const TodoCard = ({ todo, onToggle, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`glass rounded-2xl p-4 transition-all duration-300 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 group ${
        todo.completed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Toggle complete */}
        <button
          id={`toggle-${todo._id}`}
          onClick={() => onToggle(todo)}
          className="mt-0.5 flex-shrink-0 text-violet-400 hover:text-violet-300 transition-colors"
        >
          {todo.completed ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5 text-gray-500 group-hover:text-violet-400/60" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className={`font-medium leading-tight ${
              todo.completed ? 'line-through text-gray-500' : 'text-gray-100'
            }`}
          >
            {todo.title}
          </p>

          {todo.description && (
            <>
              {expanded && (
                <p className="mt-1 text-sm text-gray-400 leading-relaxed">{todo.description}</p>
              )}
              <button
                onClick={() => setExpanded((e) => !e)}
                className="mt-1 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {expanded ? 'Less' : 'Details'}
              </button>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            id={`edit-${todo._id}`}
            onClick={() => onEdit(todo)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-violet-400 transition-all"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            id={`delete-${todo._id}`}
            onClick={() => onDelete(todo._id)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
