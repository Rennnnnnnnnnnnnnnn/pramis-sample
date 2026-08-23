import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableHabit({
    habit,
    onEdit,
    onDelete,
}) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: habit.habit_id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex min-w-70 w-full items-center justify-between"
        >

            {/* DRAG HANDLE */}
            <button
                {...attributes}
                {...listeners}
                type="button"
                className="flex h-6 w-6 shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
            >
                <span
                    className="h-3 w-3 rounded-full"
                    style={{
                        backgroundColor: habit.color,
                    }}
                />
            </button>

            {/* HABIT INFO */}
            <div className="flex min-w-0 flex-1 items-center gap-2">
                <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-[#e8dcc2]">
                        {habit.name}
                    </div>

                    <div className="text-xs text-[#829b7d]">
                        {habit.frequency}
                    </div>
                </div>

            </div>

            {/* EDIT / DELETE */}
            <div className="flex shrink-0 gap-1">

                <button
                    onClick={() => onEdit(habit)}
                    className="rounded px-1 text-blue-400 hover:text-blue-300"
                >
                    ✏️
                </button>

                <button
                    onClick={() => onDelete(habit)}
                    className="rounded px-1 text-red-400 hover:text-red-300"
                >
                    🗑
                </button>

            </div>

        </div>
    );
}

export default SortableHabit;