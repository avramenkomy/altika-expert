from django.db import models

class Position(models.Model):
    title = models.CharField('Должность', max_length=255, unique=True)
    order = models.PositiveBigIntegerField('Порядок отображения', default=0)

    class Meta:
        verbose_name = 'Должность'
        verbose_name_plural = 'Должности'
        ordering = ( 'order', 'title' )

    def __str__(self):
        return self.title


class Specialization(models.Model):
    title = models.CharField(
        'Наименование специализации',
        max_length=255,
        unique=True
    )
    order = models.PositiveBigIntegerField('Порядок отображения', default=0)

    class Meta:
        verbose_name = 'Специализация'
        verbose_name_plural = 'Специализации'
        ordering = ( 'order', 'title' )

    def __str__(self):
        return self.title


class Expert(models.Model):
    last_name = models.CharField('Фамилия', max_length=100)
    first_name = models.CharField('Имя', max_length=100)
    middle_name = models.CharField('Отчество', max_length=100, blank=True)

    slug = models.SlugField('Slug', max_length=255, unique=True)

    photo = models.ImageField(
        'Фото',
        upload_to='experts/photos/',
        blank=True,
        null=True,
    )

    positions = models.ManyToManyField(
        Position,
        verbose_name='Должности',
        related_name='experts',
        blank=True,
    )

    spezializations = models.ManyToManyField(
        Specialization,
        verbose_name='Специализации',
        related_name='experts',
        blank=True,
    )

    education = models.TextField(
        'Образование',
        blank=True,
    )

    experience = models.TextField(
        'Опыт работы',
        blank=True,
    )

    qualification = models.TextField(
        'Квалификация',
        blank=True,
    )

    biography = models.TextField(
        'Информация о специалисте',
        blank=True,
    )

    order = models.PositiveBigIntegerField(
        'Порядок отображения',
        default=0,
    )

    is_active = models.BooleanField('Отображать на сайте', default=True)

    created_at = models.DateTimeField('Создано', auto_now_add=True)
    updated_at = models.DateTimeField('Изменено', auto_now=True)

    class Meta:
        verbose_name = 'Специалист'
        verbose_name_plural = 'Специалисты'
        ordering = ( 'order', 'last_name', 'first_name', )

    def __str__(self):
        return self.full_name

    @property
    def full_name(self):
        parts = [
            self.last_name,
            self.first_name,
            self.middle_name
        ]
        return ' '.join(part for part in parts if part)


class ExpertDocument(models.Model):
    class DocumentType(models.TextChoices):
        DIPLOMA = 'diploma', 'Диплом'
        CERTIFICATE = 'certificate', 'Сертификат'
        OTHER = 'other', 'Другой документ'

    expert = models.ForeignKey(
        Expert,
        verbose_name='Специалист',
        related_name='documents',
        on_delete=models.CASCADE
    )

    title = models.CharField(
        'Наименование документа',
        max_length=255,
        blank=True
    )

    document_type = models.CharField(
        'Тип документа',
        max_length=20,
        choices=DocumentType.choices,
        default=DocumentType.CERTIFICATE
    )

    image = models.ImageField(
        'Изабражение документа',
        upload_to='experts/documents/'
    )

    order = models.PositiveBigIntegerField(
        'Порядок отображения',
        default=0
    )

    is_active = models.BooleanField(
        'Отображать на сайте',
        default=True,
    )

    class Meta:
        verbose_name = 'Документ специалиста'
        verbose_name_plural = 'Документы специалиста'
        ordering = ('order', 'id')

    def __str__(self):
        return self.title or self.get_document_type_display()
