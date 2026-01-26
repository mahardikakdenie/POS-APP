import React, { createContext, useContext, useState } from 'react';

const SettingsContext = createContext<any>(null);

export const SettingsProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [bgImage, setBgImage] = useState(
		'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070',
	);

	return (
		<SettingsContext.Provider value={{ bgImage, setBgImage }}>
			{children}
		</SettingsContext.Provider>
	);
};

export const useSettings = () => useContext(SettingsContext);
