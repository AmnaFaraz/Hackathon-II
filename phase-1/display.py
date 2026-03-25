from datetime import datetime
from rich.console import Console
from rich.table import Table
from rich.text import Text
from rich import box
from models import Task

console = Console()


def _relative_time(dt: datetime) -> str:
    diff = datetime.now() - dt
    seconds = int(diff.total_seconds())
    if seconds < 60:
        return f"{seconds}s ago"
    minutes = seconds // 60
    if minutes < 60:
        return f"{minutes}m ago"
    hours = minutes // 60
    if hours < 24:
        return f"{hours}h ago"
    days = hours // 24
    return f"{days}d ago"


def _truncate(text: str, max_len: int) -> str:
    if len(text) <= max_len:
        return text
    return text[: max_len - 3] + "..."


def render_tasks(tasks: list[Task], title: str = "Tasks") -> None:
    if not tasks:
        console.print(f"\n[dim]No tasks found.[/dim]\n")
        return

    table = Table(
        title=title,
        box=box.ROUNDED,
        border_style="bright_black",
        header_style="bold cyan",
        show_lines=True,
    )

    table.add_column("ID", style="bold yellow", width=4, justify="center")
    table.add_column("Status", width=8, justify="center")
    table.add_column("Title", style="bold white", width=30)
    table.add_column("Description", style="dim white", width=50)
    table.add_column("Created", style="dim cyan", width=12)

    for task in tasks:
        status = Text("✅", justify="center") if task.completed else Text("⬜", justify="center")
        title_text = Text(_truncate(task.title, 30))
        if task.completed:
            title_text.stylize("strike dim")

        table.add_row(
            str(task.id),
            status,
            title_text,
            _truncate(task.description or "", 50),
            _relative_time(task.created_at),
        )

    console.print()
    console.print(table)
    console.print()


def print_success(msg: str) -> None:
    console.print(f"[bold green]✓[/bold green] {msg}")


def print_error(msg: str) -> None:
    console.print(f"[bold red]✗[/bold red] {msg}")


def print_info(msg: str) -> None:
    console.print(f"[bold cyan]ℹ[/bold cyan] {msg}")


def print_help() -> None:
    table = Table(box=box.SIMPLE, border_style="bright_black", show_header=False)
    table.add_column("Command", style="bold yellow", width=25)
    table.add_column("Description", style="white")

    commands = [
        ("add", "Add a new task"),
        ("list [all|pending|completed]", "List tasks (default: all)"),
        ("complete <id>", "Mark task as completed"),
        ("update <id>", "Update task title/description"),
        ("delete <id>", "Delete a task"),
        ("help", "Show this help"),
        ("exit / quit", "Exit the app"),
    ]

    for cmd, desc in commands:
        table.add_row(cmd, desc)

    console.print("\n[bold cyan]Panaversity TODO[/bold cyan] — Available Commands:")
    console.print(table)
