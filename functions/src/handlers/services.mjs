export const servicesHandler = async (event) => {
  const services = [
    { name: 'Cryotherapy - Chamber', duration: 40 },
    { name: 'Cryotherapy - Tub', duration: 40 },
    { name: 'Deep Tissue Massage Therapy', duration: 80 },
    { name: 'Pre Event Massage Therapy', duration: 30 },
    { name: 'Post Event Massage Therapy', duration: 135 },
    { name: 'Sauna Room', duration: 60 },
  ];
  const response = {
    statusCode: 200,
    body: JSON.stringify(services),
  };
  return response;
};
