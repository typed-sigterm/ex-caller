import JSConfetti from 'js-confetti'

export const confetti = new JSConfetti()

export function nextFrame() {
  return new Promise(
    resolve => requestAnimationFrame(resolve),
  )
}
