'use client';

import { useState } from 'react';

// /api/contact へフォーム内容をJSONで送り、成功したら thanksPath へ移動する。
// extraPayload はフォームに無い固定値（inquiryType など）を足すために使う。
export default function useContactSubmit({ thanksPath, errorMessage, extraPayload }) {
    const [status, setStatus] = useState('idle');
    const isSubmitting = status === 'submitting';

    async function handleSubmit(event) {
        event.preventDefault();
        if (isSubmitting) return;

        setStatus('submitting');
        const payload = Object.fromEntries(new FormData(event.currentTarget).entries());

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...payload, ...extraPayload }),
            });
            if (!response.ok) throw new Error('Contact request failed.');
            window.location.assign(thanksPath);
        } catch {
            setStatus('error');
        }
    }

    return {
        handleSubmit,
        isSubmitting,
        errorMessage: status === 'error' ? errorMessage : '',
    };
}
