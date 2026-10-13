const publicImage = (fileName: string) => `${import.meta.env.BASE_URL}images/${fileName}`;

export const eventImages = {
  liveNight: publicImage('open-air-crowd.jpg'),
  loginBackdrop: publicImage('login-evening.jpg'),
  discoveryHero: publicImage('live-stage-orange.jpg'),
  concert: publicImage('concert_stage_sightline_1790632768688.jpg'),
  comedy: publicImage('comedy_gala_stage_1790632806745.jpg'),
  technology: publicImage('tech_conference_stage_1790632796490.jpg'),
  summit: publicImage('business_summit_hall_1790632816697.jpg'),
  lounge: publicImage('vip_lounge_amenity_1790632783951.jpg'),
};

export const fallbackImage = publicImage('event-image-fallback.svg');
