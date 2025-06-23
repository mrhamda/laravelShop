import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export default forwardRef(function FileInputMe({ className = '', isFocused = false, ...props }, ref) {
    const localRef = useRef(null);
    const { value, ...restProps } = props;

    const [url, setUrl] = useState(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
        click: () => localRef.current?.click(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const handleClick = () => {
        localRef.current?.click();

        setUrl(localRef.current.value);
    };

    return (
        <div className="flex w-full items-center justify-center">
            <div
                onClick={handleClick}
                className="light:border-gray-600 light:bg-gray-700 light:hover:border-gray-500 light:hover:bg-gray-600 light:hover:bg-gray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
            >
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <svg
                        className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                    </svg>
                    {url !== null ? (
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            Avatar selected
                            {localRef.current.value.split('\\').pop()}
                        </p>
                    ) : (
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                    )}

                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
                <input id="dropzone-file" type="file" ref={localRef} className={`hidden ${className}`} {...restProps} />
            </div>
        </div>
    );
});
