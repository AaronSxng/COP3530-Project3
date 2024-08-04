import pygame
import sys


# Define colors
BACKGROUND = (200, 200, 200)
BLACK = (0, 0, 0)
GRAY = (150, 150, 150)
HOVER = (150, 150, 200)
CLICK = (150, 150, 225)

class TextBox:
    def __init__(self, x, y, width, height, text='', color=GRAY, active_color=HOVER, text_color=BLACK):
        self.rect = pygame.Rect(x, y, width, height)
        self.color = color
        self.active_color = active_color
        self.text_color = text_color
        self.text = text
        self.enteredText = ''
        self.font = pygame.font.SysFont(None, 30)
        self.active = False
        self.x = x
        self.y = y
        self.width = width
        self.height = height

    def handle_event(self, event):
        if event.type == pygame.MOUSEBUTTONDOWN:
            if self.rect.collidepoint(event.pos):
                self.active = not self.active
            else:
                self.active = False
        if event.type == pygame.KEYDOWN:
            if self.active:
                if event.key == pygame.K_RETURN: #
                    print(self.text)
                    self.enteredText = self.text
                    self.text = ''
                    self.rect.x = self.x
                    self.rect.y = self.y
                elif event.key == pygame.K_BACKSPACE:
                    self.text = self.text[:-1]
                else:
                    self.text += event.unicode


    def render_text(self, text, font, color, max_width):
        lines = []
        current_line = ""

        for word in text:
            if font.size(word)[0] > max_width:
                while word:
                    for i in range(len(word), 0, -1):
                        if font.size(word[:i])[0] <= max_width:
                            lines.append(font.render(word[:i], True, color))
                            word = word[i:]
                            break
            else:
                test_line = current_line + word + ""
                if font.size(test_line)[0] <= max_width:
                    current_line = test_line
                else:
                    lines.append(font.render(current_line, True, color))
                    current_line = word + ""

        if current_line:
            lines.append(font.render(current_line, True, color))

        return lines

    def draw(self, screen):
        color = self.active_color if self.active else self.color
        pygame.draw.rect(screen, color, self.rect, 2)

        lines = self.render_text(self.text, self.font, self.text_color, self.rect.width - 10)

        total_height = sum(line.get_height() for line in lines)
        start_y = self.rect.y + (self.rect.height - total_height) // 2
        self.rect.h = self.height

        for line in lines:
            line_width = line.get_width()
            start_x = self.rect.x + (self.rect.width - line_width) // 2
            screen.blit(line, (start_x, start_y))
            start_y += line.get_height()
            self.rect.height += (line.get_height()/1)

        self.rect.w = max(100, self.rect.width)
