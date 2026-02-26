'use client';

import { useTransition } from 'react';
import { handleDeleteItem } from '@/lib/actions/item-action';

type Props = {
    itemId: string;
};

export default function DeleteButton({ itemId }: Props) {
    const [isPending, startTransition] = useTransition();

    const handleClick = (e: React.MouseEvent) => {
        if (!confirm('Are you sure you want to delete this bouquet?')) {
            e.preventDefault();
            return;
        }

        startTransition(async () => {
            await handleDeleteItem(itemId);
        });
    };

    return (
        <button
            type="button"
            disabled={isPending}
            onClick={handleClick}
            className="text-rose-600 hover:text-rose-800 font-medium disabled:opacity-50"
        >
            {isPending ? 'Deleting...' : 'Delete'}
        </button>
    );
}