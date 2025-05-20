// This is a test script to simulate audio functionality
// Run this in the browser console to test audio handling

// Simulate a track being published
function simulateTrackPublished() {
  console.log('Simulating track published event');
  
  // Create a dummy audio element
  const audioElement = document.createElement('audio');
  audioElement.id = 'test-audio';
  document.body.appendChild(audioElement);
  
  // Set the current volume from the slider
  const volumeSlider = document.getElementById('volume-slider');
  if (volumeSlider) {
    const volume = parseInt(volumeSlider.value, 10) / 100;
    audioElement.volume = volume;
    console.log(`Set test audio volume to ${volume}`);
  }
  
  // Create an audio context and oscillator to generate a test tone
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Start the oscillator and stop after 2 seconds
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      audioElement.remove();
      console.log('Test audio stopped');
    }, 2000);
    
    console.log('Test audio started');
  } catch (e) {
    console.error('Error creating test audio:', e);
  }
}

// Test volume changes
function testVolumeChange() {
  console.log('Testing volume change functionality');
  
  const audioElements = document.querySelectorAll('audio');
  console.log(`Found ${audioElements.length} audio elements`);
  
  // Log current volume of all audio elements
  audioElements.forEach((audio, index) => {
    console.log(`Audio ${index} volume: ${audio.volume}`);
  });
  
  // Create a new test audio element
  const testAudio = document.createElement('audio');
  testAudio.id = 'test-volume-audio';
  testAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
  testAudio.loop = true;
  document.body.appendChild(testAudio);
  
  // Set initial volume
  const volumeSlider = document.getElementById('volume-slider');
  if (volumeSlider) {
    testAudio.volume = parseInt(volumeSlider.value, 10) / 100;
  }
  
  // Play the test audio
  testAudio.play().catch(e => console.error('Error playing test audio:', e));
  
  console.log('Test audio created with volume:', testAudio.volume);
  
  // Clean up after 5 seconds
  setTimeout(() => {
    testAudio.pause();
    testAudio.remove();
    console.log('Volume test completed');
  }, 5000);
}

// Export test functions
window.testAudio = {
  simulateTrackPublished,
  testVolumeChange
};

console.log('Audio test utilities loaded. Call window.testAudio.simulateTrackPublished() or window.testAudio.testVolumeChange() to test.');